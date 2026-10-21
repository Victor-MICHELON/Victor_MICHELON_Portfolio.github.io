// EN/FR switch. The HTML holds the English text; the French one is keyed by data-i18n.
//   data-i18n="key"       replaces the element's HTML
//   data-i18n-aria="key"  replaces its aria-label
// Shared strings (header, footer, navigation) live below; each page adds its own in an
// inline <script> that sets window.I18N_FR before this file runs.
// The choice is kept in localStorage; without one, a French browser gets French.
(function () {
  "use strict";

  var SHARED = {
    "c.skip": "Aller au contenu",
    "c.skipProjects": "Aller aux projets",
    "c.experience": "Expérience",
    "c.projects": "Projets",
    "c.about": "À propos",
    "c.contact": "Contact",
    "c.all": "Tous les projets",
    "c.onpage": "Sur cette page",
    "c.toc": "Sur cette page",
    "c.others": "Autres projets",
    "c.prev": "← Projet précédent",
    "c.next": "Projet suivant →",
    "c.source": "Code source de ce site",
    "c.cta": "Lire l’étude de cas",
    "c.demo": "Démo en ligne",
    "c.edge": "Ce qui le différencie",
    "c.stakes": "L’enjeu.",
    "c.usual": "L’approche classique",
    "c.breaks": "Où elle casse.",
    "c.mine": "Ce que j’ai fait autrement",
    "c.ours": "Ce que nous avons fait autrement",
    "c.proof": "La preuve",
    "c.notdo": "Ce qu’il ne fait pas.",
    "c.shows": "Ce que ça démontre."
  };

  var FR = Object.assign({}, SHARED, window.I18N_FR || {});

  var LABELS = {
    en: { theme: function (n) { return "Switch to " + n + " theme"; }, light: "light", dark: "dark", lang: "Switch to French", copy: "Copy", copied: "Copied" },
    fr: { theme: function (n) { return "Passer au thème " + n; }, light: "clair", dark: "sombre", lang: "Switch to English", copy: "Copier", copied: "Copié" }
  };

  var root = document.documentElement;

  function stored() {
    try { var v = localStorage.getItem("lang"); if (v === "en" || v === "fr") return v; } catch (e) {}
    return null;
  }

  function initial() {
    var s = stored();
    if (s) return s;
    var nav = (navigator.language || "en").toLowerCase();
    return nav.indexOf("fr") === 0 ? "fr" : "en";
  }

  function apply(lang) {
    root.lang = lang;
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (el) {
      if (el.dataset.en === undefined) el.dataset.en = el.innerHTML;
      var fr = FR[el.getAttribute("data-i18n")];
      el.innerHTML = lang === "fr" && fr !== undefined ? fr : el.dataset.en;
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-aria]"), function (el) {
      if (el.dataset.enAria === undefined) el.dataset.enAria = el.getAttribute("aria-label") || "";
      var fr = FR[el.getAttribute("data-i18n-aria")];
      el.setAttribute("aria-label", lang === "fr" && fr !== undefined ? fr : el.dataset.enAria);
    });
    Array.prototype.forEach.call(document.querySelectorAll(".lang-toggle"), function (b) {
      b.setAttribute("aria-label", LABELS[lang].lang);
      b.title = LABELS[lang].lang;
      Array.prototype.forEach.call(b.querySelectorAll("[data-lang]"), function (s) {
        s.classList.toggle("on", s.getAttribute("data-lang") === lang);
      });
    });
    document.dispatchEvent(new CustomEvent("langchange", { detail: { lang: lang, labels: LABELS[lang] } }));
  }

  window.SITE_LANG = {
    get: function () { return root.lang === "fr" ? "fr" : "en"; },
    labels: function () { return LABELS[root.lang === "fr" ? "fr" : "en"]; }
  };

  Array.prototype.forEach.call(document.querySelectorAll(".lang-toggle"), function (b) {
    b.addEventListener("click", function () {
      var next = window.SITE_LANG.get() === "fr" ? "en" : "fr";
      try { localStorage.setItem("lang", next); } catch (e) {}
      apply(next);
    });
  });

  apply(initial());
})();
