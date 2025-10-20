# pnwelectricalengineering.com — Landing Page

A lean, high-converting landing page for PNW Electrical Engineering, PLLC.

## Quick Deploy (GitHub Pages)

1) Create a public repo, e.g. `pnwelectricalengineering.com`.
2) Upload all files in this folder to the repo root (including `CNAME`).
3) In GitHub: **Settings → Pages → Source: Deploy from a branch → Branch: main /root**.
4) DNS at your domain registrar:
   - `A` records (apex @) → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `AAAA` records (optional) → 2606:50c0:8000::153, 2606:50c0:8001::153, 2606:50c0:8002::153, 2606:50c0:8003::153
   - `CNAME` for `www` → `yourusername.github.io` (or point `www` to apex, depending on preference)
5) In GitHub Pages, enable **Enforce HTTPS** after the certificate is provisioned.

## Form: Update Recipient
The contact form uses FormSubmit. Update the `action` in `index.html` to your preferred inbox:
```html
<form action="https://formsubmit.co/casey@pnwengineer.com" method="POST">
```
- If you prefer another email, replace it and push.
- Form redirects to `/thankyou.html` on this domain, then provides a link to `pnwengineer.com`.

## Edits
- Branding color is set in CSS variable `--brand`. Swap to match your logo if desired.
- Replace `assets/img/logo.svg` with your logo (keep the same filename), or update the `<img>` path in the header.
- Update copy in the Services section to match your exact offerings.

## Notes
- This domain is intended as a targeted landing page (PPC/search). Your main site remains `https://pnwengineer.com`.
- `robots.txt` and `sitemap.xml` provided for basic SEO hygiene.
