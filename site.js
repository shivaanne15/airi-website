// Progressive enhancement — polish only. Every page works, reads, and submits without this file.
document.documentElement.classList.add('js');

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

// --- sticky header: show a shadow once the page scrolls under it ---
const header = document.querySelector('.site-header');

// --- mobile navigation: collapse the wrapped link rows behind a menu button ---
const nav = document.querySelector('.site-nav');
if (nav) {
  nav.id = 'site-nav';
  const toggle = document.createElement('button');
  toggle.className = 'nav-toggle';
  toggle.setAttribute('aria-expanded', 'false');
  toggle.setAttribute('aria-controls', 'site-nav');
  toggle.setAttribute('aria-label', 'Menu');
  toggle.append(...[0, 0, 0].map(() => document.createElement('span')));
  toggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(open));
  });
  const bar = document.querySelector('.header-top');
  (bar || nav.parentNode).append(toggle);
  // choosing a page closes the menu
  nav.addEventListener('click', e => {
    if (e.target.closest('a')) { nav.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
  });
}

// --- back to top, after a screen or two of scrolling ---
const toTop = document.createElement('button');
toTop.className = 'to-top';
toTop.setAttribute('aria-label', 'Back to top');
toTop.textContent = '↑';
toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: reducedMotion ? 'auto' : 'smooth' }));
document.body.append(toTop);

const onScroll = () => {
  if (header) header.classList.toggle('scrolled', scrollY > 8);
  toTop.classList.toggle('show', scrollY > 700);
};
addEventListener('scroll', onScroll, { passive: true });
onScroll();

// --- reveal cards and pathway steps as they scroll into view ---
if (!reducedMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(hits => {
    for (const hit of hits) {
      if (!hit.isIntersecting) continue;
      hit.target.classList.add('in');
      io.unobserve(hit.target);
      // drop the stagger delay once revealed, so hover transitions respond instantly
      hit.target.addEventListener('transitionend', () => { hit.target.style.transitionDelay = ''; }, { once: true });
    }
  }, { rootMargin: '0px 0px -8% 0px' });
  document.querySelectorAll('.grid, .pathway').forEach(group => {
    [...group.children].forEach((el, i) => {
      el.classList.add('reveal');
      el.style.transitionDelay = Math.min(i, 5) * 70 + 'ms'; // stagger within the row, not down the page
      io.observe(el);
    });
  });
}

// --- textareas grow with their content instead of scrolling inside themselves ---
document.querySelectorAll('textarea').forEach(box => {
  box.addEventListener('input', () => {
    box.style.height = 'auto';
    box.style.height = box.scrollHeight + 2 + 'px';
  });
});
