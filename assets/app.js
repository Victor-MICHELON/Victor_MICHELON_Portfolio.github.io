// Parkinson page: the run chart, drawn from the runs-data JSON, with a tooltip; redrawn in French on demand
(function () {
  "use strict";

  var host = document.getElementById("runs-chart");
  var dataEl = document.getElementById("runs-data");
  if (!host || !dataEl) return;

  var runs = JSON.parse(dataEl.textContent);
  var NS = "http://www.w3.org/2000/svg";

  var W = 1000, H = 440;
  var m = { l: 52, r: 24, t: 22, b: 36 };
  var iw = W - m.l - m.r, ih = H - m.t - m.b;
  var yMin = 2.3, yMax = 18;
  var SUBMITTED = "b006_seq4_gruref";
  var lnSpan = Math.log(yMax) - Math.log(yMin);

  var TEXT = {
    en: {
      verdicts: { GAIN: "better than its reference", NOISE: "within noise of its reference", WORSE: "worse than its reference", NONE: "no reference run", baseline: "baseline" },
      submitted: ", submitted model",
      title: function (n) { return "Cross-validated error across " + n + " logged runs"; },
      desc: function (a, b) { return "Error falls from " + a + " for a baseline that predicts the mean to " + b + " for the submitted blend of five models. The key steps are in the table below the chart."; },
      yAxis: "RMSE, log scale (lower is better)",
      xAxis: "Runs in the order they were logged, 7 to 14 October 2026",
      marks: {
        e000_dummy: "Predict the mean",
        e001_hgb_raw: "Boosting on raw columns",
        e002_hgb_basic_context: "Previous and next visits as features",
        e007_hier_traj: "Per-patient trajectories",
        e012_traj_skew: "Skewed noise model",
        e019_long_surp_shape: "Surprise and shape features",
        e023_seq_nn: "Sequence networks per patient",
        b006_seq4_gruref: "Submitted blend of five models"
      }
    },
    fr: {
      verdicts: { GAIN: "meilleur que sa référence", NOISE: "dans le bruit de sa référence", WORSE: "moins bon que sa référence", NONE: "pas de run de référence", baseline: "baseline" },
      submitted: ", modèle soumis",
      title: function (n) { return "Erreur en validation croisée sur les " + n + " runs journalisés"; },
      desc: function (a, b) { return "L’erreur passe de " + a + " pour une baseline qui prédit la moyenne à " + b + " pour le mélange de cinq modèles soumis. Les étapes clés sont dans le tableau sous le graphique."; },
      yAxis: "RMSE, échelle logarithmique (plus bas = mieux)",
      xAxis: "Runs dans l’ordre où ils ont été journalisés, du 7 au 14 octobre 2026",
      marks: {
        e000_dummy: "Prédire la moyenne",
        e001_hgb_raw: "Boosting sur les colonnes brutes",
        e002_hgb_basic_context: "Visites précédente et suivante",
        e007_hier_traj: "Trajectoires par patient",
        e012_traj_skew: "Modèle de bruit asymétrique",
        e019_long_surp_shape: "Surprises et forme de la courbe",
        e023_seq_nn: "Réseaux séquentiels par patient",
        b006_seq4_gruref: "Mélange de cinq modèles soumis"
      }
    }
  };

  function x(i) { return m.l + (i * iw) / (runs.length - 1); }
  function y(v) { return m.t + ((Math.log(yMax) - Math.log(v)) / lnSpan) * ih; }
  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  var minIdx = 0;
  runs.forEach(function (r, i) { if (r.rmse < runs[minIdx].rmse) minIdx = i; });
  runs.forEach(function (r, i) { if (r.id === SUBMITTED) minIdx = i; });

  var tip = document.createElement("div");
  tip.className = "tip";
  tip.setAttribute("aria-hidden", "true");

  function draw(lang, animate) {
    var T = TEXT[lang] || TEXT.en;
    var fr = lang === "fr";
    function fmt(v, d) { var s = v.toFixed(d == null ? 2 : d); return fr ? s.replace(".", ",") : s; }

    host.innerHTML = "";
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-labelledby": "runs-title runs-desc" });
    el("title", { id: "runs-title" }, svg).textContent = T.title(runs.length);
    el("desc", { id: "runs-desc" }, svg).textContent = T.desc(fmt(runs[0].rmse), fmt(runs[runs.length - 1].rmse));

    // grid + y axis
    [3, 5, 10, 16].forEach(function (v) {
      el("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), class: "grid" }, svg);
      el("text", { x: m.l - 10, y: y(v) + 4, "text-anchor": "end", class: "axis-label" }, svg).textContent = v;
    });
    el("text", { x: m.l, y: 12, class: "axis-label" }, svg).textContent = T.yAxis;
    el("text", { x: W - m.r, y: H - 8, "text-anchor": "end", class: "axis-label" }, svg).textContent = T.xAxis;

    // running best (step line)
    var best = [], b = Infinity;
    runs.forEach(function (r) { b = Math.min(b, r.rmse); best.push(b); });
    var p = "M" + x(0) + " " + y(best[0]);
    for (var i = 1; i < runs.length; i++) p += " L" + x(i) + " " + y(best[i - 1]) + " L" + x(i) + " " + y(best[i]);
    var path = el("path", { d: p, class: "best", pathLength: 1 }, svg);

    // annotations
    var annGroup = el("g", {}, svg);
    var row = 0;
    runs.forEach(function (r, i) {
      if (!T.marks[r.id]) return;
      var first = i === 0;
      var ty = first ? 46 : 74 + row * 28;
      var endAnchor = !first && i > runs.length * 0.7;
      var tx = first ? x(1) + 12 : endAnchor ? x(i) - 8 : x(i) + 8;
      if (!first) el("line", { x1: x(i), x2: x(i), y1: ty - 5, y2: y(r.rmse) - 7, class: "leader" }, annGroup);
      var txt = el("text", { x: tx, y: ty, "text-anchor": endAnchor ? "end" : "start", class: "ann" }, annGroup);
      txt.appendChild(document.createTextNode(T.marks[r.id] + "  "));
      el("tspan", { class: "val" }, txt).textContent = fmt(r.rmse);
      if (!first) row++;
    });

    // dots
    var dots = el("g", {}, svg);
    runs.forEach(function (r, i) {
      var cx = x(i), cy = y(r.rmse);
      if (r.verdict === "WORSE" && i !== minIdx) {
        el("path", { d: "M" + (cx - 4) + " " + (cy - 4) + "l8 8M" + (cx + 4) + " " + (cy - 4) + "l-8 8", class: "cross" }, dots);
      }
      var cls = r.verdict === "GAIN" ? "dot-gain" : r.verdict === "NOISE" ? "dot-noise" : r.verdict === "WORSE" ? "dot-hit" : "dot-base";
      if (i === minIdx) {
        el("circle", { cx: cx, cy: cy, r: 10, class: "halo" }, dots);
        cls = "dot-min";
      }
      var c = el("circle", { cx: cx, cy: cy, r: 5, class: "dot " + cls }, dots);
      c.addEventListener("pointerenter", function () { show(i); });
      c.addEventListener("pointerleave", hide);
    });

    host.appendChild(svg);
    host.appendChild(tip);

    function show(i) {
      var r = runs[i];
      var verdict = T.verdicts[r.verdict] || "";
      if (r.id === SUBMITTED) verdict += T.submitted;
      tip.innerHTML = "<b>" + r.id + "</b><br>RMSE " + fmt(r.rmse, 3) + ", " + verdict;
      var box = svg.getBoundingClientRect();
      var fbox = host.getBoundingClientRect();
      var px = box.left - fbox.left + (x(i) / W) * box.width;
      var py = box.top - fbox.top + (y(r.rmse) / H) * box.height;
      tip.style.left = Math.max(90, Math.min(fbox.width - 90, px)) + "px";
      tip.style.top = py + "px";
      tip.classList.add("on");
    }

    if (animate) {
      // one orchestrated moment: the best-so-far line draws once, when the chart scrolls into view
      path.style.strokeDasharray = 1;
      path.style.strokeDashoffset = 1;
      var all = dots.querySelectorAll("circle");
      var start = function () {
        path.animate([{ strokeDashoffset: 1 }, { strokeDashoffset: 0 }], { duration: 1600, easing: "cubic-bezier(.3,.6,.2,1)", fill: "both" });
        Array.prototype.forEach.call(all, function (c, i) {
          c.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 260, delay: (i / all.length) * 1400, fill: "backwards" });
        });
        annGroup.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 1500, fill: "backwards" });
      };
      if ("IntersectionObserver" in window) {
        var io = new IntersectionObserver(function (entries) {
          if (entries[0].isIntersecting) { io.disconnect(); start(); }
        }, { threshold: 0.35 });
        io.observe(host);
      } else {
        start();
      }
    }
  }
  function hide() { tip.classList.remove("on"); }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var current = window.SITE_LANG ? window.SITE_LANG.get() : "en";
  draw(current, !reduce && !!host.animate);
  document.addEventListener("langchange", function (e) {
    if (e.detail.lang === current) return;
    current = e.detail.lang;
    draw(current, false);
  });
})();
