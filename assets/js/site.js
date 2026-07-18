/* Diamond House Blessings LLC — motion & interaction
   Graceful: IntersectionObserver reveals always work; GSAP enhances.
   Native scroll only (no smooth-scroll library). */
(function () {
  "use strict";
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    || /[?&]static\b/.test(window.location.search);

  /* ---- Year ---- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });

  /* ---- Nav: scrolled state + mobile menu ---- */
  var nav = document.querySelector(".nav");
  function onScroll() { if (nav) nav.classList.toggle("scrolled", window.scrollY > 40); }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  var toggle = document.querySelector(".nav-toggle");
  if (toggle) {
    toggle.addEventListener("click", function () { document.body.classList.toggle("menu-open"); });
    document.querySelectorAll(".nav-links a").forEach(function (a) {
      a.addEventListener("click", function () { document.body.classList.remove("menu-open"); });
    });
  }

  /* ---- Reveal on scroll ---- */
  var revealEls = document.querySelectorAll(".reveal, .lines");
  if (reduce) {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  } else if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.16, rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---- Hero lines ---- */
  window.addEventListener("load", function () {
    setTimeout(function () {
      document.querySelectorAll(".lines.hero-lines").forEach(function (el) { el.classList.add("in"); });
    }, 200);
  });

  /* ---- Animated counters ---- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var suffix = el.getAttribute("data-suffix") || "";
    var dur = 1600, start = null;
    function step(ts) {
      if (!start) start = ts;
      var p = Math.min((ts - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var counters = document.querySelectorAll("[data-count]");
  if (counters.length) {
    if (reduce) {
      counters.forEach(function (el) { el.textContent = el.getAttribute("data-count") + (el.getAttribute("data-suffix") || ""); });
    } else {
      var co = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { animateCount(e.target); co.unobserve(e.target); } });
      }, { threshold: 0.6 });
      counters.forEach(function (el) { co.observe(el); });
    }
  }

  /* ---- In-page anchor jumps: instant + reveal destination ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    var id = a.getAttribute("href").slice(1);
    if (!id) return;
    a.addEventListener("click", function (e) {
      var target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      document.body.classList.remove("menu-open");
      target.querySelectorAll(".reveal, .lines").forEach(function (el) { el.classList.add("in"); });
      target.scrollIntoView({ behavior: "instant", block: "start" });
      if (history.replaceState) history.replaceState(null, "", "#" + id);
    });
  });

  /* ---- Waitlist / interest form ----
     Production path: Netlify Forms (the markup already carries data-netlify).
     Preview path: on a static host without a form backend (GitHub Pages, local
     file), we compose a pre-filled email to the client so the form still works
     for a real visitor. Swap FALLBACK_EMAIL or wire Formspree / Pathworth
     Intelligence in one place. */
  var FALLBACK_EMAIL = "Info@diamondhouseblessings.com";
  function hasFormBackend() {
    // Netlify serves these hosts; there the native POST is captured.
    return /netlify\.app$/.test(location.hostname) || /diamondhouseblessings\.com$/.test(location.hostname);
  }
  document.querySelectorAll("form[data-interest]").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      if (hasFormBackend()) return; // let Netlify handle it for real
      e.preventDefault();
      var data = new FormData(form);
      var lines = [];
      data.forEach(function (v, k) {
        if (k === "bot-field" || k === "form-name" || !String(v).trim()) return;
        lines.push(k.replace(/(^|[-_])(\w)/g, function (_, s, c) { return (s ? " " : "") + c.toUpperCase(); }) + ": " + v);
      });
      var subject = "New housing interest — Diamond House Blessings";
      var body = "A new inquiry was submitted from the website:\n\n" + lines.join("\n") +
        "\n\nSent from diamondhouseblessings website.";
      var ok = form.querySelector("[data-form-ok]");
      if (ok) { ok.style.display = "block"; form.querySelector("[data-form-fields]").style.display = "none"; }
      window.location.href = "mailto:" + FALLBACK_EMAIL +
        "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    });
  });

  /* ---- GSAP parallax on NATIVE scroll (enhancement only) ---- */
  if (reduce) return;
  if (window.gsap && window.ScrollTrigger) {
    var gsap = window.gsap;
    gsap.registerPlugin(window.ScrollTrigger);

    gsap.utils.toArray("[data-parallax]").forEach(function (el) {
      var depth = parseFloat(el.getAttribute("data-parallax")) || 12;
      gsap.fromTo(el, { yPercent: -depth }, {
        yPercent: depth, ease: "none",
        scrollTrigger: { trigger: el.parentElement, start: "top bottom", end: "bottom top", scrub: true }
      });
    });

    var heroMedia = document.querySelector("[data-hero-media]");
    if (heroMedia) {
      gsap.to(heroMedia, {
        scale: 1.16, opacity: 0.32, ease: "none",
        scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true }
      });
    }

    gsap.utils.toArray("[data-wipe]").forEach(function (el) {
      var words = el.querySelectorAll(".w");
      if (!words.length) return;
      gsap.fromTo(words, { opacity: 0.16 }, {
        opacity: 1, stagger: 0.08, ease: "none",
        scrollTrigger: { trigger: el, start: "top 78%", end: "bottom 55%", scrub: true }
      });
    });
  }
})();
