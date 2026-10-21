// small charts for the case study pages, drawn from JSON blocks in the page
// <div class="chart" data-chart="bars|grouped|radar" data-src="<id of a JSON script>"></div>
// A spec may hold an "fr" object: its fields replace the English ones when the page is in French
// (arrays are merged item by item). Charts are redrawn when the language changes.
(function () {
  "use strict";

  var NS = "http://www.w3.org/2000/svg";
  var WORDS = {
    en: { value: "Value", weight: "Weight", base: "base", selected: "Selected profile", baseProfile: "Base profile", profile: "Source film profile" },
    fr: { value: "Valeur", weight: "Poids", base: "base", selected: "Profil choisi", baseProfile: "Profil de base", profile: "Profil du film de départ" }
  };
  function lang() { return window.SITE_LANG ? window.SITE_LANG.get() : "en"; }
  function W() { return WORDS[lang()]; }

  function isObj(v) { return v && typeof v === "object" && !Array.isArray(v); }
  function merge(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) {
      return a.map(function (v, i) { return i < b.length ? (isObj(v) && isObj(b[i]) ? merge(v, b[i]) : b[i]) : v; });
    }
    if (isObj(a) && isObj(b)) {
      var out = {};
      Object.keys(a).forEach(function (k) { out[k] = a[k]; });
      Object.keys(b).forEach(function (k) { out[k] = k in a ? merge(a[k], b[k]) : b[k]; });
      return out;
    }
    return b;
  }

  function el(name, attrs, parent, ns) {
    var n = ns ? document.createElementNS(NS, name) : document.createElement(name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function fmt(v, f) {
    var fr = lang() === "fr";
    if (f === "pct0") return Math.round(v * 100) + (fr ? " %" : "%");
    if (f === "pct1") return fr ? (v * 100).toFixed(1).replace(".", ",") + " %" : (v * 100).toFixed(1) + "%";
    if (f === "dec3") return fr ? v.toFixed(3).replace(".", ",") : v.toFixed(3);
    if (f === "int") return Math.round(v).toLocaleString(lang() === "fr" ? "fr-FR" : "en-US");
    var out = f === "dec1" ? v.toFixed(1) : v.toFixed(2);
    return lang() === "fr" ? out.replace(".", ",") : out;
  }

  // one tooltip per chart, positioned over the hovered mark
  function tooltip(host) {
    var tip = el("div", { class: "tip", "aria-hidden": "true" }, host);
    return {
      show: function (mark, html) {
        tip.innerHTML = html;
        var h = host.getBoundingClientRect(), m = mark.getBoundingClientRect();
        var x = m.left - h.left + m.width / 2;
        tip.style.left = Math.max(80, Math.min(h.width - 80, x)) + "px";
        tip.style.top = m.top - h.top + "px";
        tip.classList.add("on");
      },
      hide: function () { tip.classList.remove("on"); }
    };
  }

  function hover(mark, tip, html) {
    mark.addEventListener("pointerenter", function () { tip.show(mark, html); });
    mark.addEventListener("pointerleave", tip.hide);
  }

  // horizontal bars, one series; "muted": true de-emphasizes an item
  function bars(host, spec) {
    var max = spec.max || Math.max.apply(null, spec.items.map(function (d) { return d.value; }));
    var list = el("ul", { class: "bars" }, host);
    var tip = tooltip(host);
    spec.items.forEach(function (d) {
      var li = el("li", { class: d.muted ? "is-muted" : "" }, list);
      el("span", { class: "bar-label" }, li).textContent = d.label;
      var track = el("span", { class: "bar-track" }, li);
      var bar = el("span", { class: "bar" }, track);
      bar.style.width = (100 * d.value / max) + "%";
      el("span", { class: "bar-value" }, li).textContent = fmt(d.value, spec.format);
      hover(li, tip, "<b>" + d.label + "</b><br>" + (spec.valueName || W().value) + " " + fmt(d.value, spec.format) + (d.note ? "<br>" + d.note : ""));
    });
    return list;
  }

  // grouped horizontal bars: one group per category, one bar per series
  function grouped(host, spec) {
    var legend = el("ul", { class: "chart-legend" }, host);
    spec.series.forEach(function (s) {
      var li = el("li", {}, legend);
      el("span", { class: "key" + (s.muted ? " is-muted" : "") }, li);
      li.appendChild(document.createTextNode(s.name));
    });
    var list = el("ul", { class: "bars bars-grouped" }, host);
    var tip = tooltip(host);
    spec.categories.forEach(function (cat, i) {
      var li = el("li", {}, list);
      el("span", { class: "bar-label" }, li).textContent = cat;
      var stack = el("span", { class: "bar-stack" }, li);
      spec.series.forEach(function (s) {
        var row = el("span", { class: "bar-row" + (s.muted ? " is-muted" : "") }, stack);
        var track = el("span", { class: "bar-track" }, row);
        var bar = el("span", { class: "bar" }, track);
        bar.style.width = (100 * s.values[i] / spec.max) + "%";
        el("span", { class: "bar-value" }, row).textContent = fmt(s.values[i], spec.format);
        hover(row, tip, "<b>" + cat + "</b><br>" + s.name + ": " + (spec.valueName || "") + " " + fmt(s.values[i], spec.format));
      });
    });
  }

  // radar of weights with a profile switch; the base profile stays drawn as a reference
  function radar(host, spec) {
    var keys = Object.keys(spec.profiles);
    var controls = el("div", { class: "segmented", role: "group", "aria-label": W().profile }, host);
    var wrap = el("div", { class: "radar-wrap" }, host);
    var frame = el("div", { class: "radar-frame" }, wrap);
    var side = el("div", { class: "radar-side" }, wrap);

    var S = 420, C = S / 2, R = 150, n = spec.axes.length;
    var svg = el("svg", { viewBox: "0 0 " + S + " " + S, role: "img", "aria-label": spec.label }, frame, true);
    function pt(i, v) {
      var a = -Math.PI / 2 + (2 * Math.PI * i) / n;
      return [C + Math.cos(a) * R * v / spec.max, C + Math.sin(a) * R * v / spec.max];
    }
    spec.rings.forEach(function (r) {
      var p = spec.axes.map(function (_, i) { return pt(i, r).join(","); }).join(" ");
      el("polygon", { points: p, class: "ring" }, svg, true);
      var lab = el("text", { x: C + 4, y: pt(0, r)[1] - 3, class: "ring-label" }, svg, true);
      lab.textContent = fmt(r, spec.format);
    });
    spec.axes.forEach(function (name, i) {
      var end = pt(i, spec.max);
      el("line", { x1: C, y1: C, x2: end[0], y2: end[1], class: "spoke" }, svg, true);
      var lp = pt(i, spec.max * 1.16);
      var anchor = Math.abs(lp[0] - C) < 8 ? "middle" : lp[0] > C ? "start" : "end";
      var t = el("text", { x: lp[0], y: lp[1] + 4, "text-anchor": anchor, class: "axis-name" }, svg, true);
      t.textContent = name;
    });
    function shape(values, cls) {
      var p = values.map(function (v, i) { return pt(i, v).join(","); }).join(" ");
      return el("polygon", { points: p, class: cls }, svg, true);
    }
    var base = spec.profiles[spec.base].weights;
    shape(base, "shape-base");
    var current = shape(base, "shape-current");
    var dots = el("g", {}, svg, true);
    var tip = tooltip(frame);

    var legend = el("ul", { class: "chart-legend" }, side);
    var l1 = el("li", {}, legend); el("span", { class: "key" }, l1); l1.appendChild(document.createTextNode(W().selected));
    var l2 = el("li", {}, legend); el("span", { class: "key is-muted" }, l2); l2.appendChild(document.createTextNode(W().baseProfile));
    var note = el("p", { class: "radar-note" }, side);
    var listHost = el("div", {}, side);

    var buttons = keys.map(function (k) {
      var b = el("button", { type: "button", "aria-pressed": "false" }, controls);
      b.textContent = spec.profiles[k].label;
      b.addEventListener("click", function () { host.dataset.profile = k; select(k); });
      return b;
    });

    function select(k) {
      var prof = spec.profiles[k];
      buttons.forEach(function (b, i) { b.setAttribute("aria-pressed", keys[i] === k ? "true" : "false"); });
      current.setAttribute("points", prof.weights.map(function (v, i) { return pt(i, v).join(","); }).join(" "));
      while (dots.firstChild) dots.removeChild(dots.firstChild);
      prof.weights.forEach(function (v, i) {
        var p = pt(i, v);
        var hit = el("circle", { cx: p[0], cy: p[1], r: 12, class: "hit" }, dots, true);
        el("circle", { cx: p[0], cy: p[1], r: 4.5, class: "dot" }, dots, true);
        hover(hit, tip, "<b>" + spec.axes[i] + "</b><br>weight " + fmt(v, spec.format) + " (base " + fmt(base[i], spec.format) + ")");
      });
      note.textContent = prof.note;
      listHost.innerHTML = "";
      bars(listHost, {
        max: spec.max, format: spec.format, valueName: W().weight,
        items: spec.axes.map(function (name, i) { return { label: name, value: prof.weights[i] }; })
      });
    }
    select(host.dataset.profile && spec.profiles[host.dataset.profile] ? host.dataset.profile : spec.base);
  }

  var kinds = { bars: bars, grouped: grouped, radar: radar };
  function draw() {
    Array.prototype.forEach.call(document.querySelectorAll(".chart[data-chart]"), function (host) {
      var src = document.getElementById(host.getAttribute("data-src"));
      var kind = kinds[host.getAttribute("data-chart")];
      if (!src || !kind) return;
      var spec = JSON.parse(src.textContent);
      if (lang() === "fr" && spec.fr) spec = merge(spec, spec.fr);
      host.innerHTML = "";
      kind(host, spec);
    });
  }
  draw();
  document.addEventListener("langchange", draw);
})();
