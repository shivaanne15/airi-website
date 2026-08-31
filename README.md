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
| `refer.html` | Referral criteria, required records, **inpatient referral form** |
| `outpatient.html` | **Outpatient referral form** |
| `patients.html` | Patient and caregiver education library |
| `contact.html` | Contact details and **consultation request form** |
| `privacy.html` | Privacy and accessibility statement |
| `style.css` | All styling |
| `form.js` | Turns a form into an email |
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

Then open <http://localhost:8765>.

## Changing the email addresses

Each form carries its destination in one attribute.

- `refer.html` → `<form ... data-mailto="referrals@airispecialtyinfusion.com">`
- `contact.html` → `<form ... data-mailto="info@airispecialtyinfusion.com">`

Change the address in that attribute and the form sends there. The addresses also appear as
plain links in the page footer and on `contact.html`.

## Changing the phone and fax numbers

Search for `(209) 313-4433` and `(209) 290-3664` across the `.html` files.

## How the forms work

There is no backend. When someone presses **Email this referral** or **Email this request**,
the browser opens their own email program with the completed form already written into the
message body; they review it and press send. Blank fields are dropped, and a section heading
whose fields are all blank is dropped with them.

The **Copy as text** button puts the same text on the clipboard, for anyone whose browser is
not set up to open an email program. A form too long to fit inside an email link is copied to
the clipboard automatically, and a blank addressed message opens for pasting.

With JavaScript off, the forms fall back to the browser's own mailto submission (raw but
functional), and a note points visitors to the phone and fax numbers. Everything else on the
site — including the navigation — works without JavaScript too; `site.js` is polish only.

This keeps patient information inside the sender's own email account rather than passing it
through a third-party form service — but ordinary email is still not a secure channel for
protected health information, which is why every form says so and points to the secure fax
number. If AIRI later adopts a HIPAA-capable intake vendor, replace the `submit` handler in
`form.js` with a `fetch` to that vendor and leave everything else alone.

### Checking `form.js` still works

Open any page with a form and add `?selftest` to the URL, e.g. `refer.html?selftest`, then
look at the browser console. It prints `form.js selftest: PASS` or a diff.

## Adding a page

Copy an existing page, replace the content between `<main id="main">` and `</main>`, and add
the page to the `<nav>` list in every file. Seven files, one line each — faster than
introducing a template system for a site this size.
