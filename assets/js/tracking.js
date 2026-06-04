(function () {
  window.dataLayer = window.dataLayer || [];

  function isPlaceholder(value) {
    return !value || /REPLACE|XXXX|GTM-XXXX|G-XXXX|AW-XXXX/.test(String(value));
  }

  function loadScript(src, attrs) {
    var s = document.createElement('script');
    s.async = true;
    s.src = src;
    if (attrs) {
      Object.keys(attrs).forEach(function (key) { s.setAttribute(key, attrs[key]); });
    }
    document.head.appendChild(s);
    return s;
  }

  function pushDataLayer(eventName, params) {
    var payload = Object.assign({ event: eventName }, params || {});
    window.dataLayer.push(payload);
  }

  function track(eventName, params) {
    pushDataLayer(eventName, params);
    if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, params || {});
    }
  }

  window.pnwTrack = track;

  var cfg = window.PNW_TRACKING_CONFIG || {};

  // Existing Google Tag Manager container.
  if (!isPlaceholder(cfg.gtmId)) {
    (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer',cfg.gtmId);
  }

  // Optional standalone GA4 / Google Ads fallback. Leave blank when those are already managed in GTM.
  if (!isPlaceholder(cfg.ga4MeasurementId) || !isPlaceholder(cfg.googleAdsId)) {
    var firstId = !isPlaceholder(cfg.ga4MeasurementId) ? cfg.ga4MeasurementId : cfg.googleAdsId;
    loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(firstId));
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function(){ window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    if (!isPlaceholder(cfg.ga4MeasurementId)) window.gtag('config', cfg.ga4MeasurementId);
    if (!isPlaceholder(cfg.googleAdsId)) window.gtag('config', cfg.googleAdsId);
  }

  // Existing Microsoft Advertising / Bing UET tag.
  if (!isPlaceholder(cfg.bingUetId) && !window.__pnwBingUetLoaded) {
    window.__pnwBingUetLoaded = true;
    (function(w,d,t,u,o){
      w[u]=w[u]||[];
      o.ts=(new Date).getTime();
      var n=d.createElement(t);
      n.src='https://bat.bing.net/bat.js?ti='+encodeURIComponent(o.ti)+('uetq'!=u?'&q='+u:'');
      n.async=1;
      n.onload=n.onreadystatechange=function(){
        var s=this.readyState;
        if (s && s !== 'loaded' && s !== 'complete') return;
        o.q=w[u];
        if (typeof UET === 'function') {
          w[u]=new UET(o);
          w[u].push('pageLoad');
        }
        n.onload=n.onreadystatechange=null;
      };
      var i=d.getElementsByTagName(t)[0];
      i.parentNode.insertBefore(n,i);
    })(window,document,'script','uetq',{ti:String(cfg.bingUetId), enableAutoSpaTracking:true});
  }

  function fireLeadSubmitEvents(formName) {
    var params = {
      form_name: formName || 'quote_request',
      lead_type: 'commercial_design_build',
      page_path: window.location.pathname
    };

    pushDataLayer('form_submit_attempt', params);
    pushDataLayer('generate_lead', params);
    pushDataLayer('conversion_event_submit_lead_form', params);

    // Microsoft UET custom lead event; safe no-op if UET is blocked or unavailable.
    try {
      if (window.uetq && typeof window.uetq.push === 'function') {
        window.uetq.push('event', 'lead_form_submit', {
          event_category: 'lead',
          event_label: params.form_name,
          page_path: params.page_path
        });
      }
    } catch (err) {}

    return params;
  }

  // Form tracking: preserves the same Apps Script POST/action, while allowing the existing Google Ads/GA event to fire first.
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || !form.matches || !form.matches('form[data-track-form]')) return;
    if (form.__pnwSubmitting) return;

    e.preventDefault();

    var submitted = false;
    var formName = form.getAttribute('data-track-form') || 'quote_request';
    var params = fireLeadSubmitEvents(formName);

    function submitForm() {
      if (submitted) return;
      submitted = true;
      form.__pnwSubmitting = true;
      form.submit();
    }

    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion_event_submit_lead_form', Object.assign({}, params, {
        event_callback: submitForm,
        event_timeout: 2000
      }));
      setTimeout(submitForm, 2100);
    } else {
      setTimeout(submitForm, 350);
    }
  }, true);

  // Click tracking for phone, email, and CTA clicks.
  document.addEventListener('click', function (e) {
    var link = e.target.closest && e.target.closest('a, button');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    var label = link.getAttribute('data-track-click') || link.textContent.trim().slice(0, 80);
    if (href.indexOf('tel:') === 0) {
      track('click_to_call', { click_label: label, phone: href.replace('tel:', ''), page_path: window.location.pathname });
    } else if (href.indexOf('mailto:') === 0) {
      track('email_click', { click_label: label, email: href.replace('mailto:', ''), page_path: window.location.pathname });
    } else if (link.hasAttribute('data-track-click')) {
      track('cta_click', { click_label: label, destination: href, page_path: window.location.pathname });
    }
  }, true);
})();
