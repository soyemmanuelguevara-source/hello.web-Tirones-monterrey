const WHATSAPP_NUMBER = "528135662636";
const DEFAULT_MESSAGE = "Hola, quiero información sobre tirones con Tirones Monterrey.";

document.body.classList.add("loading");

let loaderHidden = false;
function hideLoader() {
  if (loaderHidden) return;
  loaderHidden = true;
  window.setTimeout(() => {
    const loader = document.getElementById("loader");
    if (loader) loader.classList.add("hide");
    document.body.classList.remove("loading");
  }, 1700);
}

document.addEventListener("DOMContentLoaded", hideLoader);
window.addEventListener("load", hideLoader);

const nav = document.getElementById("nav");
const ham = document.getElementById("ham");
const mob = document.getElementById("mob");

const setNavState = () => {
  if (!nav) return;
  nav.classList.toggle("scrolled", window.scrollY > 16);
};

setNavState();
window.addEventListener("scroll", setNavState, { passive: true });

if (ham && mob) {
  ham.addEventListener("click", () => {
    const open = mob.classList.toggle("open");
    ham.classList.toggle("active", open);
    ham.setAttribute("aria-expanded", String(open));
  });

  mob.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mob.classList.remove("open");
      ham.classList.remove("active");
      ham.setAttribute("aria-expanded", "false");
    });
  });
}

const phrases = [
  "remolques",
  "cuatrimotos y razors",
  "food trucks",
  "racks de bicicleta",
  "canastillas portaequipaje"
];

const twText = document.getElementById("twText");
let phraseIndex = 0;
let charIndex = 0;
let deleting = false;

function typeLoop() {
  if (!twText) return;
  const phrase = phrases[phraseIndex];
  twText.textContent = phrase.slice(0, charIndex);

  if (!deleting && charIndex < phrase.length) {
    charIndex += 1;
    window.setTimeout(typeLoop, 62);
    return;
  }

  if (!deleting && charIndex === phrase.length) {
    deleting = true;
    window.setTimeout(typeLoop, 1200);
    return;
  }

  if (deleting && charIndex > 0) {
    charIndex -= 1;
    window.setTimeout(typeLoop, 34);
    return;
  }

  deleting = false;
  phraseIndex = (phraseIndex + 1) % phrases.length;
  window.setTimeout(typeLoop, 240);
}

typeLoop();

function countTo(el) {
  if (el.dataset.counted === "true") return;
  const target = Number(el.dataset.count || el.dataset.heroCount || 0);
  const prefix = el.dataset.prefix || "";
  const suffix = el.dataset.suffix || "";
  const duration = 1300;
  const start = performance.now();

  el.dataset.counted = "true";

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = Math.round(target * eased);
    el.textContent = `${prefix}${value}${suffix}`;
    if (progress < 1) requestAnimationFrame(tick);
  };

  requestAnimationFrame(tick);
}

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add("show");
    entry.target.querySelectorAll("[data-count], [data-hero-count]").forEach(countTo);
    if (entry.target.matches("[data-count], [data-hero-count]")) countTo(entry.target);
  });
}, { threshold: 0.18, rootMargin: "0px 0px -40px 0px" });

document.querySelectorAll(".rev, [data-count], [data-hero-count]").forEach((el) => {
  revealObserver.observe(el);
});

document.querySelectorAll(".hero-stats [data-hero-count]").forEach((el) => {
  window.setTimeout(() => countTo(el), 1900);
});

function buildWhatsAppUrl(message) {
  const cleanNumber = WHATSAPP_NUMBER.replace(/\D/g, "");
  const text = encodeURIComponent(message || DEFAULT_MESSAGE);
  return cleanNumber ? `https://wa.me/${cleanNumber}?text=${text}` : `https://wa.me/?text=${text}`;
}

document.querySelectorAll("[data-whatsapp-link]").forEach((link) => {
  const message = link.getAttribute("data-message") || DEFAULT_MESSAGE;
  link.setAttribute("href", buildWhatsAppUrl(message));
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener noreferrer");
});

const form = document.getElementById("cForm");
if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!form.reportValidity()) return;

    const data = new FormData(form);
    const message = [
      "Hola, quiero cotizar un tirón con Tirones Monterrey.",
      `Nombre: ${data.get("nombre")}`,
      `Telefono: ${data.get("telefono")}`,
      `Qué necesita: ${data.get("tipo")}`,
      `Vehiculo/detalles: ${data.get("mensaje") || "No especificado"}`
    ].join("\n");

    window.open(buildWhatsAppUrl(message), "_blank", "noopener,noreferrer");
  });
}

function createParticles(canvasId, options = {}) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const count = options.count || 52;
  const color = options.color || "rgba(56, 213, 255, .72)";
  const alt = options.alt || "rgba(255, 31, 45, .52)";
  let width = 0;
  let height = 0;
  let particles = [];
  let frame = null;

  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    const ratio = Math.min(window.devicePixelRatio || 1, 2);
    width = rect.width;
    height = rect.height;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - .5) * (options.speed || .42),
      vy: (Math.random() - .5) * (options.speed || .42),
      r: Math.random() * 1.8 + .55,
      c: Math.random() > .72 ? alt : color
    }));
  };

  const draw = () => {
    ctx.clearRect(0, 0, width, height);

    for (let i = 0; i < particles.length; i += 1) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.c;
      ctx.fill();

      for (let j = i + 1; j < particles.length; j += 1) {
        const q = particles[j];
        const dx = p.x - q.x;
        const dy = p.y - q.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const limit = options.link || 118;
        if (dist < limit) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(255,255,255,${(1 - dist / limit) * .16})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }

    frame = requestAnimationFrame(draw);
  };

  resize();
  draw();

  window.addEventListener("resize", () => {
    cancelAnimationFrame(frame);
    resize();
    draw();
  }, { passive: true });
}

createParticles("pcanvas", { count: 70, speed: .38, link: 132 });
createParticles("pcanvasWhy", { count: 44, speed: .3, link: 108 });
createParticles("pcanvasGaleria", { count: 62, speed: .34, link: 122 });

const parallaxEls = document.querySelectorAll(".bg-fixed");
const moveBackgrounds = () => {
  const offset = window.scrollY * .08;
  parallaxEls.forEach((el, index) => {
    el.style.transform = `translate3d(0, ${offset * (index % 2 ? -.18 : .18)}px, 0) scale(1.06)`;
  });
};

moveBackgrounds();
window.addEventListener("scroll", moveBackgrounds, { passive: true });
