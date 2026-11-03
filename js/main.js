/* =========================================================
   GMIP landing page — behaviour
   ========================================================= */

/* ---------------------------------------------------------
   PROTOTYPE LINK — EDIT THIS ONE LINE
   Paste the public URL of the functional prototype here
   (e.g. a GitHub Pages / Figma / Vercel link). Every button
   with the attribute  data-prototype-link  will open it.
   Leave it empty ("") to show a "coming soon" message.
   --------------------------------------------------------- */
const PROTOTYPE_URL = "";

/* Where contact-form requests are sent (opens the visitor's email app) */
const CONTACT_EMAIL = "hello@gmip.fi";

(function () {
  "use strict";

  /* ----- Prototype buttons ----- */
  const toast = document.getElementById("toast");
  let toastTimer;

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  document.querySelectorAll("[data-prototype-link]").forEach((el) => {
    if (PROTOTYPE_URL) {
      el.setAttribute("href", PROTOTYPE_URL);
      el.setAttribute("target", "_blank");
      el.setAttribute("rel", "noopener");
    } else {
      el.setAttribute("href", "#");
      el.setAttribute("aria-describedby", "toast");
      el.addEventListener("click", (e) => {
        e.preventDefault();
        showToast("The interactive prototype is on its way — check back soon.");
      });
    }
  });

  /* ----- Sticky header shadow ----- */
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("is-scrolled", window.scrollY > 8);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ----- Mobile navigation ----- */
  const toggle = document.querySelector(".nav-toggle");
  if (toggle && header) {
    toggle.addEventListener("click", () => {
      const open = header.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    header.querySelectorAll(".main-nav a, .header-actions a").forEach((a) =>
      a.addEventListener("click", () => {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && header.classList.contains("nav-open")) {
        header.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
        toggle.focus();
      }
    });
  }

  /* ----- Contact form (static site: validates, then opens a pre-filled email) ----- */
  const form = document.getElementById("contact-form");
  const success = document.getElementById("form-success");
  if (form) {
    const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v);
    const rules = {
      name: (el) => el.value.trim().length > 1,
      email: (el) => emailOk(el.value.trim()),
      company: (el) => el.value.trim().length > 1,
      consent: (el) => el.checked,
    };

    const check = (el) => {
      const ok = rules[el.name](el);
      const field = el.closest(".field");
      field.classList.toggle("has-error", !ok);
      el.setAttribute("aria-invalid", String(!ok));
      return ok;
    };

    Object.keys(rules).forEach((name) => {
      const el = form.elements[name];
      el.addEventListener(el.type === "checkbox" ? "change" : "blur", () => check(el));
      el.addEventListener("input", () => { if (el.closest(".field").classList.contains("has-error")) check(el); });
    });

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const invalid = Object.keys(rules).map((n) => form.elements[n]).filter((el) => !check(el));
      if (invalid.length) { invalid[0].focus(); return; }

      const f = form.elements;
      const subject = `Partner enquiry: ${f.company.value.trim()} (${f.topic.value})`;
      const body = [
        `Name: ${f.name.value.trim()}`,
        `Email: ${f.email.value.trim()}`,
        `Store or chain: ${f.company.value.trim()}`,
        `Role: ${f.role.value.trim() || "-"}`,
        `Number of stores: ${f.stores.value}`,
        `Interested in: ${f.topic.value}`,
        "",
        f.message.value.trim() || "(no message)",
      ].join("\n");

      window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      if (success) { success.classList.add("is-visible"); success.focus(); }
      form.reset();
    });
  }

  /* =====================================================
     MOTION: scroll reveals, counters, progress, scrollspy
     ===================================================== */
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ----- Scroll-reveal groups: [selector, variant, stagger in seconds] ----- */
  const revealGroups = [
    [".section-head", "", 0],
    [".friction-card", "", 0.12],
    [".journey", "reveal-scale", 0],
    [".mode", "reveal-left", 0.1],
    [".adaptive", "reveal-right", 0],
    [".cap", "", 0.08],
    [".step", "", 0.15],
    [".steps-note", "", 0],
    [".stat", "", 0.1],
    [".benefit", "", 0.1],
    [".model", "", 0.12],
    [".cta-band", "reveal-scale", 0],
    [".quote-feature", "reveal-scale", 0],
    [".quote-card", "", 0.12],
    [".sample-note", "", 0],
    [".member", "reveal-scale", 0.08],
    [".contact-list li", "reveal-left", 0.08],
    [".map-card", "reveal-left", 0.1],
    [".form-card", "reveal-right", 0],
    [".footer-grid > *", "", 0.08],
  ];

  if (!reduceMotion && "IntersectionObserver" in window) {
    const REVEAL_MS = 800;

    revealGroups.forEach(([selector, variant, stagger]) => {
      document.querySelectorAll(selector).forEach((el) => {
        const index = Array.prototype.indexOf.call(el.parentElement.children, el);
        el.classList.add("reveal");
        if (variant) el.classList.add(variant);
        if (stagger) el.style.setProperty("--d", (Math.min(index, 6) * stagger).toFixed(2) + "s");
      });
    });

    // Prepare counters at zero (they count up when visible)
    const counters = document.querySelectorAll("[data-count]");
    const formatCount = (el, n) => `${el.dataset.prefix || ""}${n}${el.dataset.suffix || ""}`;
    counters.forEach((el) => { el.textContent = formatCount(el, 0); });

    const runCounter = (el) => {
      const target = Number(el.dataset.count);
      const duration = 1200;
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = formatCount(el, Math.round(target * eased));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        el.classList.add("is-in");
        revealObserver.unobserve(el);

        const counter = el.querySelector("[data-count]");
        if (counter) setTimeout(() => runCounter(counter), parseFloat(el.style.getPropertyValue("--d") || 0) * 1000 + 200);

        // After the entrance, drop the reveal classes so hover effects feel instant
        if (el.classList.contains("reveal")) {
          const delay = parseFloat(el.style.getPropertyValue("--d") || 0) * 1000;
          setTimeout(() => {
            el.classList.remove("reveal", "reveal-left", "reveal-right", "reveal-scale");
            el.style.removeProperty("--d");
          }, REVEAL_MS + delay + 150);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    document.querySelectorAll(".reveal, .steps").forEach((el) => revealObserver.observe(el));
  } else {
    // Reduced motion: show the map route mid-way and keep it still
    document.querySelectorAll(".route-svg").forEach((svg) => {
      if (svg.setCurrentTime) { svg.setCurrentTime(2.6); svg.pauseAnimations(); }
    });
  }

  /* ----- Scroll progress bar + back-to-top button ----- */
  const progress = document.querySelector(".scroll-progress");
  const toTop = document.querySelector(".to-top");
  let ticking = false;
  const updateScrollUI = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    if (progress) progress.style.transform = `scaleX(${ratio})`;
    if (toTop) toTop.classList.toggle("is-visible", window.scrollY > 900);
    ticking = false;
  };
  window.addEventListener("scroll", () => {
    if (!ticking) { requestAnimationFrame(updateScrollUI); ticking = true; }
  }, { passive: true });
  updateScrollUI();

  /* ----- Scrollspy: highlight the menu link of the section in view ----- */
  const navLinks = Array.from(document.querySelectorAll('.main-nav a[href^="#"]'));
  if (navLinks.length && "IntersectionObserver" in window) {
    const setActive = (id) => navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === "#" + id));
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    document.querySelectorAll("main section[id]").forEach((sec) => spy.observe(sec));
  }

  /* ----- Footer year ----- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
})();
