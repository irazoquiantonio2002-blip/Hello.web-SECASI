const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

const loader = qs("#loader");
const navbar = qs("#navbar");
const hamburger = qs("#hamburger");
const mobileMenu = qs("#mob-menu");
const year = qs("#year");

if (year) year.textContent = new Date().getFullYear();

const hideLoader = () => {
  window.setTimeout(() => loader?.classList.add("is-hidden"), 450);
};

hideLoader();
document.addEventListener("DOMContentLoaded", hideLoader);
window.addEventListener("load", hideLoader);

const syncNavbar = () => {
  navbar?.classList.toggle("is-scrolled", window.scrollY > 18);
};

syncNavbar();
window.addEventListener("scroll", syncNavbar, { passive: true });

hamburger?.addEventListener("click", () => {
  const isOpen = hamburger.classList.toggle("is-open");
  hamburger.setAttribute("aria-expanded", String(isOpen));
  mobileMenu?.classList.toggle("is-open", isOpen);
});

qsa("#mob-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    hamburger?.classList.remove("is-open");
    hamburger?.setAttribute("aria-expanded", "false");
    mobileMenu?.classList.remove("is-open");
  });
});

const marquee = qs("#marquee");
if (marquee) {
  const items = [
    ["fa-kit-medical", "Primeros auxilios y RCP"],
    ["fa-fire-extinguisher", "Combate de incendios"],
    ["fa-biohazard", "Materiales peligrosos"],
    ["fa-person-running", "Evacuación de inmuebles"],
    ["fa-person-hiking", "Búsqueda y rescate"],
    ["fa-user-shield", "Comando de incidentes"],
    ["fa-certificate", "Registro STPS DC-3"]
  ];

  marquee.innerHTML = [...items, ...items]
    .map(([icon, text]) => `<span><i class="fa-solid ${icon}"></i>${text}</span>`)
    .join("");
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.14 });

qsa(".reveal").forEach((element) => revealObserver.observe(element));

const animateCount = (element) => {
  const target = Number(element.dataset.count || 0);
  const suffix = element.dataset.suffix || "";
  const duration = 1300;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    element.textContent = `${Math.round(target * eased)}${suffix}`;

    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
};

const statObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      animateCount(entry.target);
      statObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.45 });

qsa(".stat-num").forEach((element) => statObserver.observe(element));

const form = qs("#wa-form");
form?.addEventListener("submit", (event) => {
  event.preventDefault();

  const name = qs("#f-name")?.value.trim();
  const interest = qs("#f-interest")?.value;
  const message = qs("#f-msg")?.value.trim();

  if (!name || !message) {
    form.reportValidity();
    return;
  }

  const text = [
    "Hola SECASI, visité su sitio web y quiero información.",
    `Nombre: ${name}`,
    `Interés: ${interest}`,
    `Detalle: ${message}`
  ].join("\n");

  window.open(`https://wa.me/525554787354?text=${encodeURIComponent(text)}`, "_blank", "noopener,noreferrer");
});

const canvas = qs("#hero-canvas");
const context = canvas?.getContext("2d");
let particles = [];
let animationFrame;

const resizeCanvas = () => {
  if (!canvas || !context) return;
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  canvas.width = Math.floor(canvas.offsetWidth * ratio);
  canvas.height = Math.floor(canvas.offsetHeight * ratio);
  context.setTransform(ratio, 0, 0, ratio, 0, 0);

  const count = Math.max(26, Math.floor(canvas.offsetWidth / 34));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * canvas.offsetWidth,
    y: Math.random() * canvas.offsetHeight,
    r: Math.random() * 2.2 + 0.8,
    vx: Math.random() * 0.24 - 0.12,
    vy: Math.random() * -0.22 - 0.06,
    alpha: Math.random() * 0.4 + 0.12
  }));
};

const drawParticles = () => {
  if (!canvas || !context) return;
  context.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

  particles.forEach((p) => {
    p.x += p.vx;
    p.y += p.vy;

    if (p.y < -10) p.y = canvas.offsetHeight + 10;
    if (p.x < -10) p.x = canvas.offsetWidth + 10;
    if (p.x > canvas.offsetWidth + 10) p.x = -10;

    const gradient = context.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 6);
    gradient.addColorStop(0, `rgba(245, 178, 29, ${p.alpha})`);
    gradient.addColorStop(1, "rgba(245, 178, 29, 0)");

    context.fillStyle = gradient;
    context.beginPath();
    context.arc(p.x, p.y, p.r * 6, 0, Math.PI * 2);
    context.fill();
  });

  animationFrame = requestAnimationFrame(drawParticles);
};

if (canvas && context && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  resizeCanvas();
  drawParticles();
  window.addEventListener("resize", resizeCanvas, { passive: true });
}

window.addEventListener("beforeunload", () => {
  if (animationFrame) cancelAnimationFrame(animationFrame);
});
