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
  var yMin = 2.5, yMax = 18;
  var lnSpan = Math.log(yMax) - Math.log(yMin);

  function x(i) { return m.l + (i * iw) / (runs.length - 1); }
  function y(v) { return m.t + ((Math.log(yMax) - Math.log(v)) / lnSpan) * ih; }
  function el(name, attrs, parent) {
    var n = document.createElementNS(NS, name);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }
  function fmt(v) { return v.toFixed(2); }

  var svg = el("svg", { viewBox: "0 0 " + W + " " + H, role: "img", "aria-labelledby": "runs-title runs-desc" });
  var t = el("title", { id: "runs-title" }, svg);
  t.textContent = "Cross-validated error across 30 logged runs";
  var d = el("desc", { id: "runs-desc" }, svg);
  d.textContent = "Error falls from 16.51 for a baseline that predicts the mean to 2.78 for the best run. The same numbers are in the table below the chart.";

  // grid + y axis
  [3, 5, 10, 16].forEach(function (v) {
    el("line", { x1: m.l, x2: W - m.r, y1: y(v), y2: y(v), class: "grid" }, svg);
    var lab = el("text", { x: m.l - 10, y: y(v) + 4, "text-anchor": "end", class: "axis-label" }, svg);
    lab.textContent = v;
  });
  var yl = el("text", { x: m.l, y: 12, class: "axis-label" }, svg);
  yl.textContent = "RMSE, log scale (lower is better)";
  var xl = el("text", { x: W - m.r, y: H - 8, "text-anchor": "end", class: "axis-label" }, svg);
  xl.textContent = "Runs in the order they were logged, 7 to 12 October 2026";

  // running best (step line)
  var best = [], b = Infinity;
  runs.forEach(function (r) { b = Math.min(b, r.rmse); best.push(b); });
  var p = "M" + x(0) + " " + y(best[0]);
  for (var i = 1; i < runs.length; i++) {
    p += " L" + x(i) + " " + y(best[i - 1]) + " L" + x(i) + " " + y(best[i]);
  }
  var path = el("path", { d: p, class: "best", pathLength: 1 }, svg);

  // annotations
  var marks = {
    e000_dummy: "Predict the mean",
    e001_hgb_raw: "Boosting on raw columns",
    e002_hgb_basic_context: "Previous and next visits as features",
    e007_hier_traj: "Per-patient trajectories",
    e012_traj_skew: "Skewed noise model",
    e019_long_surp_shape: "Surprise and shape features",
    e022d_cubic_wprior: "Cubic trajectories"
  };
  var minIdx = 0;
  runs.forEach(function (r, i) { if (r.rmse < runs[minIdx].rmse) minIdx = i; });

  var annGroup = el("g", {}, svg);
  var row = 0;
  runs.forEach(function (r, i) {
    if (!marks[r.id]) return;
    var first = i === 0;
    var ty = first ? 46 : 74 + row * 28;
    var endAnchor = !first && i > runs.length * 0.7;
    var tx = first ? x(1) + 12 : endAnchor ? x(i) - 8 : x(i) + 8;
    if (!first) el("line", { x1: x(i), x2: x(i), y1: ty - 5, y2: y(r.rmse) - 7, class: "leader" }, annGroup);
    var txt = el("text", { x: tx, y: ty, "text-anchor": endAnchor ? "end" : "start", class: "ann" }, annGroup);
    txt.appendChild(document.createTextNode(marks[r.id] + "  "));
    var v = el("tspan", { class: "val" }, txt);
    v.textContent = fmt(r.rmse);
    if (!first) row++;
  });

  // dots
  var tip = document.createElement("div");
  tip.className = "tip";
  tip.setAttribute("aria-hidden", "true");
  var dots = el("g", {}, svg);
  runs.forEach(function (r, i) {
    var cls = r.verdict === "GAIN" ? "dot-gain" : r.verdict === "NOISE" ? "dot-noise" : "dot-base";
    if (i === minIdx) {
      el("circle", { cx: x(i), cy: y(r.rmse), r: 10, class: "halo" }, dots);
      cls = "dot-min";
    }
    var c = el("circle", { cx: x(i), cy: y(r.rmse), r: 5, class: "dot " + cls, "data-i": i }, dots);
    c.addEventListener("pointerenter", function () { show(i); });
    c.addEventListener("pointerleave", hide);
  });

  var frame = host;
  frame.appendChild(svg);
  frame.appendChild(tip);

  function show(i) {
    var r = runs[i];
    var verdict = r.verdict === "GAIN" ? "better than its reference" : r.verdict === "NOISE" ? "within noise of its reference" : "baseline";
    tip.innerHTML = "<b>" + r.id + "</b><br>RMSE " + r.rmse.toFixed(3) + ", " + verdict;
    var box = svg.getBoundingClientRect();
    var fbox = frame.getBoundingClientRect();
    var px = box.left - fbox.left + (x(i) / W) * box.width;
    var py = box.top - fbox.top + (y(r.rmse) / H) * box.height;
    tip.style.left = Math.max(90, Math.min(fbox.width - 90, px)) + "px";
    tip.style.top = py + "px";
    tip.classList.add("on");
  }
  function hide() { tip.classList.remove("on"); }

  // one orchestrated moment: the best-so-far line draws once on load
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce && path.animate) {
    path.style.strokeDasharray = 1;
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
})();
