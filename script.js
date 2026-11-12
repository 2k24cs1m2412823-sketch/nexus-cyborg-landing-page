// NEXUS landing page interactions
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

menuToggle.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

document.querySelectorAll('.nav a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
  });
});

// Reveal elements as they enter the viewport.
const revealObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach(element => revealObserver.observe(element));

// Highlight the navigation item for the section currently in view.
const sections = document.querySelectorAll('main section[id]');
const navLinks = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
      });
    }
  });
}, { rootMargin: '-35% 0px -55% 0px' });
sections.forEach(section => sectionObserver.observe(section));

// Animate numeric stats once. The infinity symbol remains decorative.
const stats = document.querySelectorAll('[data-count]');
const statsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const element = entry.target;
    const target = Number(element.dataset.count);
    if (!Number.isFinite(target)) return;
    const duration = 1300;
    const start = performance.now();
    const update = now => {
      const progress = Math.min((now - start) / duration, 1);
      element.textContent = Math.floor(target * (1 - Math.pow(1 - progress, 3))).toString().padStart(2, '0');
      if (progress < 1) requestAnimationFrame(update);
    };
    requestAnimationFrame(update);
    statsObserver.unobserve(element);
  });
}, { threshold: 0.5 });
stats.forEach(stat => statsObserver.observe(stat));

// Demo contact form: validate and show a local confirmation only.
const contactForm = document.getElementById('contactForm');
const feedback = document.getElementById('formFeedback');
contactForm.addEventListener('submit', event => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;
  const name = document.getElementById('name').value.trim();
  feedback.textContent = `Transmission prepared, ${name}. This demo form does not send data to a server.`;
  contactForm.reset();
});

document.getElementById('year').textContent = new Date().getFullYear();
