const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
const navbar = document.getElementById('navbar');
const heroImage = document.querySelector('.hero-bg img');
const orbs = Array.from(document.querySelectorAll('.orb'));

let mouseX = 0;
let mouseY = 0;
let ringX = 0;
let ringY = 0;
let latestScrollY = window.scrollY;
let ticking = false;

if (!prefersReducedMotion && cursor && ring) {
  document.addEventListener('mousemove', event => {
    mouseX = event.clientX;
    mouseY = event.clientY;
  });

  const animateCursor = () => {
    cursor.style.left = `${mouseX}px`;
    cursor.style.top = `${mouseY}px`;
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
  };

  animateCursor();

  document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('mouseenter', () => {
      ring.style.width = '56px';
      ring.style.height = '56px';
    });
    element.addEventListener('mouseleave', () => {
      ring.style.width = '36px';
      ring.style.height = '36px';
    });
  });
}

const updateScrolledNav = () => {
  if (navbar) {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }
};

const applyParallax = () => {
  ticking = false;

  if (prefersReducedMotion) {
    return;
  }

  if (heroImage) {
    const translateY = Math.min(latestScrollY * 0.025, 10);
    heroImage.style.transform = `scale(1.02) translateY(${translateY}px)`;
  }

  orbs.forEach((orb, index) => {
    const direction = index === 0 ? 1 : -1;
    const x = latestScrollY * 0.025 * direction;
    const y = latestScrollY * 0.06 * (index + 1);
    orb.style.transform = `translate(${x}px, ${y}px)`;
  });
};

window.addEventListener('scroll', () => {
  updateScrolledNav();
  latestScrollY = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(applyParallax);
    ticking = true;
  }
}, { passive: true });

updateScrolledNav();
applyParallax();

const registerRevealClasses = () => {
  const leftRevealSelectors = ['.section-label', '.section-title', '.contact-eyebrow', '.contact-title'];
  const rightRevealSelectors = ['.about-text p', '.contact-sub', '.footer-copy', '.footer-built'];
  const scaleRevealSelectors = ['.stat-card', '.skill-group', '.contact-btn', '.btn'];

  leftRevealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => element.classList.add('reveal', 'reveal-left'));
  });

  rightRevealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => element.classList.add('reveal', 'reveal-right'));
  });

  scaleRevealSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(element => element.classList.add('reveal', 'reveal-scale'));
  });

  document.querySelectorAll('.divider, .skills-header, .projects-header, .scroll-hint, .hero-tag, .hero-desc, .hero-meta').forEach(element => {
    element.classList.add('reveal');
  });
};

registerRevealClasses();

const revealElements = document.querySelectorAll('.reveal, .fade-up');

if (prefersReducedMotion) {
  revealElements.forEach(element => {
    element.classList.add('is-visible', 'visible');
  });
} else {
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible', 'visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });

  revealElements.forEach(element => revealObserver.observe(element));
}

const skillsObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.animated === 'true') {
      return;
    }

    entry.target.dataset.animated = 'true';
    entry.target.querySelectorAll('.tag').forEach((tag, index) => {
      tag.style.opacity = '0';
      tag.style.transform = 'translateY(10px)';
      setTimeout(() => {
        tag.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
        tag.style.opacity = '1';
        tag.style.transform = 'translateY(0)';
      }, index * 40);
    });

    skillsObserver.unobserve(entry.target);
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-grid').forEach(element => skillsObserver.observe(element));

const projectObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting || entry.target.dataset.animated === 'true') {
      return;
    }

    entry.target.dataset.animated = 'true';
    entry.target.querySelectorAll('.project-card').forEach((card, index) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        window.setTimeout(() => {
          card.style.removeProperty('opacity');
          card.style.removeProperty('transform');
          card.style.removeProperty('transition');
        }, 550);
      }, index * 80);
    });

    projectObserver.unobserve(entry.target);
  });
}, { threshold: 0.1 });

document.querySelectorAll('.projects-list').forEach(element => projectObserver.observe(element));
