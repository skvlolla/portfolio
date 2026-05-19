// ── Mobile nav toggle ─────────────────────────────────────────
const navToggle = document.querySelector('.nav-toggle');
const navLinks  = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ── Scroll spy ────────────────────────────────────────────────
const sections    = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-links a');

const spy = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      allNavLinks.forEach(a => a.classList.remove('active'));
      const a = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      if (a) a.classList.add('active');
    }
  });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spy.observe(s));

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
