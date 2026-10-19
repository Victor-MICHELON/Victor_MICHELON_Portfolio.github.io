// shared by every page: the light/dark switch (the EN/FR one lives in i18n.js), and blocks that fade in as they scroll into view
(function () {
  "use strict";

  var root = document.documentElement;
  var dark = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;

  function current() {
    if (root.dataset.theme) return root.dataset.theme;
    return dark && dark.matches ? "dark" : "light";
  }

  function label(btn) {
    var next = current() === "dark" ? "light" : "dark";
    var L = window.SITE_LANG ? window.SITE_LANG.labels() : { theme: function (n) { return "Switch to " + n + " theme"; }, light: "light", dark: "dark" };
    var text = L.theme(L[next]);
    btn.setAttribute("aria-label", text);
    btn.title = text;
  }

  var buttons = document.querySelectorAll(".theme-toggle");
  Array.prototype.forEach.call(buttons, function (btn) {
    label(btn);
    btn.addEventListener("click", function () {
      var next = current() === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try { localStorage.setItem("theme", next); } catch (e) {}
      Array.prototype.forEach.call(buttons, label);
    });
  });

  document.addEventListener("langchange", function () { Array.prototype.forEach.call(buttons, label); });

  if (dark && dark.addEventListener) {
    dark.addEventListener("change", function () { Array.prototype.forEach.call(buttons, label); });
  }

  var still = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!still && "IntersectionObserver" in window) {
    var blocks = document.querySelectorAll(".card, .hero-figures li, .prose > section, .minor article");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        e.target.classList.add("is-in");
        io.unobserve(e.target);
      });
    }, { rootMargin: "0px 0px -8% 0px" });
    Array.prototype.forEach.call(blocks, function (b) {
      // blocks already on screen stay put; only the ones below the fold animate
      if (b.getBoundingClientRect().top < window.innerHeight) return;
      b.classList.add("reveal");
      io.observe(b);
    });
  }
})();
