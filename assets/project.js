// case study pages: highlight the current section in the table of contents, copy buttons on code blocks (EN/FR)
(function () {
  "use strict";

  var links = document.querySelectorAll(".toc a[href^='#']");
  if (links.length && "IntersectionObserver" in window) {
    var byId = {};
    Array.prototype.forEach.call(links, function (a) { byId[a.getAttribute("href").slice(1)] = a; });
    var visible = {};
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var firstId = null;
      Array.prototype.forEach.call(links, function (a) {
        var id = a.getAttribute("href").slice(1);
        if (!firstId && visible[id]) firstId = id;
      });
      if (!firstId) return;
      Array.prototype.forEach.call(links, function (a) { a.removeAttribute("aria-current"); });
      byId[firstId].setAttribute("aria-current", "true");
    }, { rootMargin: "-10% 0px -55% 0px" });
    Object.keys(byId).forEach(function (id) {
      var section = document.getElementById(id);
      if (section) io.observe(section);
    });
  }

  function words() { return window.SITE_LANG ? window.SITE_LANG.labels() : { copy: "Copy", copied: "Copied" }; }
  var copies = [];
  Array.prototype.forEach.call(document.querySelectorAll(".code"), function (block) {
    var pre = block.querySelector("pre");
    if (!pre || !navigator.clipboard) return;
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "copy";
    btn.textContent = words().copy;
    btn.addEventListener("click", function () {
      navigator.clipboard.writeText(pre.innerText).then(function () {
        btn.textContent = words().copied;
        setTimeout(function () { btn.textContent = words().copy; }, 1600);
      });
    });
    block.appendChild(btn);
    copies.push(btn);
  });
  document.addEventListener("langchange", function () {
    copies.forEach(function (b) { b.textContent = words().copy; });
  });
})();
