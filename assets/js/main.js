(function () {
  var toggle = document.querySelector('.nav-toggle');
  var menu = document.getElementById('primary-menu');
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }
})();
