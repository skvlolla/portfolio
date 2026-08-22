// ── Theme toggle ────────────────────────────────────────────────
const root = document.documentElement;
const themeToggle = document.querySelector('.theme-toggle');
const storedTheme = localStorage.getItem('theme');
if (storedTheme) root.setAttribute('data-theme', storedTheme);

themeToggle.addEventListener('click', () => {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const current = root.getAttribute('data-theme') || (prefersDark ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
});

// ── Mobile nav toggle ─────────────────────────────────────────
const navbar     = document.getElementById('navbar');
const navToggle  = document.querySelector('.nav-toggle');
const navLinks   = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => navbar.classList.toggle('menu-open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navbar.classList.remove('menu-open'));
});

// ── Scroll progress bar ─────────────────────────────────────────
const progressBar = document.getElementById('scroll-progress');
function updateProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + '%';
}
window.addEventListener('scroll', updateProgress, { passive: true });
updateProgress();

// ── Back to top ──────────────────────────────────────────────────
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('show', window.scrollY > window.innerHeight * 0.6);
}, { passive: true });
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ── Scroll spy + sliding nav pill ────────────────────────────────
const sections    = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');
const navPill     = document.getElementById('nav-pill');

function movePill(link) {
  if (!link || window.innerWidth <= 860) { navPill.style.opacity = 0; return; }
  navPill.style.left = link.offsetLeft + 'px';
  navPill.style.width = link.offsetWidth + 'px';
  navPill.style.opacity = 1;
}

const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (a) { a.classList.add('active'); movePill(a); }
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spy.observe(s));

window.addEventListener('resize', () => movePill(document.querySelector('.nav-links a.active')));
window.addEventListener('load', () => movePill(document.querySelector('.nav-links a.active') || allNavLinks[0]));

// ── Reveal on scroll ──────────────────────────────────────────────
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
revealEls.forEach(el => revealObserver.observe(el));

// ── Project filter ──────────────────────────────────────────────
const filterPills = document.querySelectorAll('.filter-pill');
const projectCards = document.querySelectorAll('.project-card');

filterPills.forEach(pill => {
  pill.addEventListener('click', () => {
    filterPills.forEach(p => p.classList.remove('active'));
    pill.classList.add('active');
    const filter = pill.dataset.filter;
    projectCards.forEach(card => {
      const match = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !match);
    });
  });
});

// ── Credentials tabs ──────────────────────────────────────────────
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    tabBtns.forEach(b => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// ── Certification modal ────────────────────────────────────────
const modal        = document.getElementById('cert-modal');
const modalContent = document.getElementById('modal-content');
const modalClose   = document.querySelector('.modal-close');
const backdrop     = document.querySelector('.modal-backdrop');

document.querySelectorAll('.cert-card').forEach(card => {
  card.addEventListener('click', () => {
    const type = card.dataset.type;
    const src  = card.dataset.src;
    modalContent.innerHTML = '';

    if (type === 'image') {
      const img = document.createElement('img');
      img.src = src;
      img.alt = card.querySelector('h3').textContent;
      modalContent.appendChild(img);
    } else if (type === 'pdf') {
      const iframe = document.createElement('iframe');
      iframe.src = src;
      iframe.title = card.querySelector('h3').textContent;
      modalContent.appendChild(iframe);
    }

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  });
});

function closeModal() {
  modal.classList.remove('open');
  modalContent.innerHTML = '';
  document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
backdrop.addEventListener('click', closeModal);
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });
