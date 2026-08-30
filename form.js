// Serialize a form into readable text and hand it to the visitor's email client.
// Field `name` attributes are written as human labels; names starting with "--" are
// section headings (hidden inputs), so the email reads like the paper form.
// Blank fields, and headings whose whole section came back blank, are left out.

function formText(form) {
  const entries = [];
  const at = new Map();
  for (const [key, value] of new FormData(form)) {
    const v = String(value).trim();
    if (!v) continue;
    if (key.startsWith('--')) { entries.push({ head: v.toUpperCase() }); at.clear(); continue; }
    if (at.has(key)) { entries[at.get(key)].value += ', ' + v; continue; }
    at.set(key, entries.length);
    entries.push({ label: key, value: v });
  }
  return entries
    .filter((e, i) => !e.head || (entries[i + 1] && !entries[i + 1].head))
    .map(e => e.head ? '\n' + e.head + '\n' + '-'.repeat(e.head.length) : e.label + ': ' + e.value)
    .join('\n')
    .trim();
}

// Outlook on Windows cuts a mailto link off around 2,000 characters. Rather than send a
// silently truncated referral, a long one opens a blank message and travels on the clipboard.
const MAILTO_LIMIT = 1900;

function mailtoLink(form) {
  const head = 'mailto:' + form.dataset.mailto
    + '?subject=' + encodeURIComponent(form.dataset.subject || 'Website form');
  const body = formText(form);
  const full = head + '&body=' + encodeURIComponent(body);
  return full.length <= MAILTO_LIMIT
    ? { href: full, body: body, inline: true }
    : { href: head, body: body, inline: false };
}

// clipboard.writeText needs a secure context and permission; execCommand always works.
function copyText(text) {
  const box = document.createElement('textarea');
  box.value = text;
  box.setAttribute('readonly', '');
  box.style.cssText = 'position:fixed;top:0;left:-9999px';
  document.body.appendChild(box);
  box.select();
  const ok = document.execCommand('copy');
  box.remove();
  return ok;
}

document.querySelectorAll('form[data-mailto]').forEach(form => {
  const status = form.querySelector('.msg');
  const say = text => { if (status) status.textContent = text; };
  const to = form.dataset.mailto;

  form.addEventListener('submit', event => {
    event.preventDefault();
    const mail = mailtoLink(form);
    if (mail.inline) {
      window.location.href = mail.href;
      say('Opening your email program with the form filled in — review it and press send. '
        + 'If nothing opened, use Copy as text and paste it into an email to ' + to + '.');
    } else if (copyText(mail.body)) {
      window.location.href = mail.href;
      say('This form is too long to fit inside an email link, so the whole thing has been '
        + 'copied to your clipboard. Paste it into the blank message that just opened, then send.');
    } else {
      say('This form is too long to fit inside an email link. Press Copy as text, then paste '
        + 'it into an email to ' + to + '.');
    }
  });

  const copy = form.querySelector('[data-copy]');
  if (copy) {
    const label = copy.textContent;
    let restore;
    copy.addEventListener('click', () => {
      if (copyText(formText(form))) {
        copy.textContent = 'Copied';
        say('Form copied. Paste it into an email to ' + to + '.');
        clearTimeout(restore);
        restore = setTimeout(() => { copy.textContent = label; }, 2500);
      } else {
        say('Could not copy automatically. Use the email button instead, or select the text by hand.');
      }
    });
  }
});

// Self-check: load any page with a form and add ?selftest to the URL, then look at the
// browser console. Example: refer.html?selftest
if (new URLSearchParams(location.search).has('selftest')) {
  const results = [];
  const check = (name, got, want) => results.push((got === want ? 'PASS ' : 'FAIL ') + name
    + (got === want ? '' : '\n  got:  ' + JSON.stringify(got) + '\n  want: ' + JSON.stringify(want)));

  const form = document.createElement('form');
  form.dataset.mailto = 'x@example.com';
  form.dataset.subject = 'Test';
  form.innerHTML = '<input name="--1" value="Section A">'
    + '<input name="Name" value=" Jane ">'
    + '<input name="Blank" value="">'
    + '<input type="checkbox" name="Tag" value="one" checked>'
    + '<input type="checkbox" name="Tag" value="two" checked>'
    + '<input type="checkbox" name="Tag" value="three">'
    + '<input name="--2" value="Empty section">';

  check('blank fields, empty sections, and repeated names',
    formText(form), 'SECTION A\n---------\nName: Jane\nTag: one, two');
  check('short form travels inside the mailto link', mailtoLink(form).inline, true);

  form.insertAdjacentHTML('beforeend', '<input name="Long" value="' + 'x'.repeat(MAILTO_LIMIT) + '">');
  const long = mailtoLink(form);
  check('long form falls back to a blank message', long.inline, false);
  check('long form still carries its text for the clipboard', long.body.includes('Long: xxx'), true);

  console.log('form.js selftest\n' + results.join('\n'));
}
