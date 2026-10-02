# AIRI website

Static site for the Advanced Intestinal Rehabilitation Institute. Plain HTML, one stylesheet,
one small script. No build step, no framework, no server-side code.

## Files

| File | What it is |
|---|---|
| `index.html` | Home |
| `about.html` | Mission, vision, values, leadership, founder's message |
| `conditions.html` | Conditions treated and who the program is for |
| `program.html` | Intestinal failure program, care team, escalation pathways |
| `sbs.html` | Short bowel syndrome patient guide |
| `rehab.html` | GI anatomy and intestinal rehabilitation guide |
| `transplant.html` | Intestinal transplant referral criteria (clinical reference) |
| `refer.html` | Refer & contact: phone, secure fax, email, office address |
| `outpatient.html`, `contact.html` | Redirects to `refer.html` (old links keep working) |
| `patients.html` | Patient and caregiver education library |
| `privacy.html` | Privacy and accessibility statement |
| `style.css` | All styling |
| `site.js` | Visual polish: mobile menu, scroll reveal, back-to-top, growing textareas |
| `assets/logo-mark.png` | Logo mark |

## Publishing it

Upload the whole folder to any static host — Netlify, Cloudflare Pages, GitHub Pages, or
ordinary web hosting. Point `airispecialtyinfusion.com` at it. Nothing else is required.

To preview locally:

```bash
python3 serve.py
```

(`serve.py` is a stock Python file server that also tells the browser not to cache,
so edits show up immediately.)

Then open <http://localhost:8770>.

## Changing the email addresses

The two addresses (`info@` and `referrals@airispecialtyinfusion.com`) appear as plain links on
`refer.html` and in each page footer. Search for them across the `.html` files.

## Changing the phone and fax numbers

Search for `(209) 929-8260` and `(209) 290-3664` across the `.html` files.

## Referral forms

The online referral and consultation forms were removed; referrals come in by phone and secure
fax. The forms (and `form.js`, which turned them into emails) are in git history — revert the
commit "Remove referral and consultation forms" to bring them back.

## Adding a page

Copy an existing page, replace the content between `<main id="main">` and `</main>`, and add
the page to the `<nav>` list in every file. Seven files, one line each — faster than
introducing a template system for a site this size.
