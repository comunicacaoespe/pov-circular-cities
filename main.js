/* POV site: Sort it Right! demo (illustrative) + phone tabs. Text comes from i18n.js */
(function () {
  "use strict";

  var T = window.POV_T || function (k) { return k; };

  var BINS = ["recycle", "bio", "reuse", "special"];

  var ITEMS = [
    { id: "i0", answer: "recycle",
      art: '<path d="M30 6h16v10l6 10v44a6 6 0 0 1-6 6H30a6 6 0 0 1-6-6V26l6-10z" fill="#43A3DD" stroke="#10261A" stroke-width="3" stroke-linejoin="round"/><rect x="29" y="2" width="18" height="8" rx="2" fill="#E6D711" stroke="#10261A" stroke-width="3"/>' },
    { id: "i1", answer: "bio",
      art: '<path d="M38 22c-14-10-30 0-28 20 2 18 14 32 28 32s26-14 28-32c2-20-14-30-28-20z" fill="#4ABD17" stroke="#10261A" stroke-width="3" stroke-linejoin="round"/><path d="M38 22c0-8 2-14 8-18" fill="none" stroke="#10261A" stroke-width="3" stroke-linecap="round"/>' },
    { id: "i2", answer: "reuse",
      art: '<path d="M18 6h40l4 66H44L38 30l-6 42H14z" fill="#43A3DD" stroke="#10261A" stroke-width="3" stroke-linejoin="round"/><path d="M18 14h40" stroke="#10261A" stroke-width="3"/>' },
    { id: "i3", answer: "special",
      art: '<rect x="20" y="4" width="36" height="68" rx="8" fill="#E6D711" stroke="#10261A" stroke-width="3"/><rect x="25" y="12" width="26" height="42" rx="3" fill="#FFFFFF" stroke="#10261A" stroke-width="2"/><path d="M26 14l24 38" stroke="#10261A" stroke-width="2"/>' }
  ];

  var idx = 0, score = 0, answered = false, choice = null, finished = false;

  var $ = function (id) { return document.getElementById(id); };
  var art = $("item-art"), name = $("item-name"), hint = $("item-hint");
  var binsEl = $("bins"), fb = $("feedback"), next = $("next"), prog = $("progress");

  if (!binsEl) return;

  BINS.forEach(function (id) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "bin";
    btn.dataset.bin = id;
    btn.addEventListener("click", function () { choose(id); });
    binsEl.appendChild(btn);
  });

  // Paints the whole demo from the current state, so a language change keeps the round intact.
  function paint() {
    T = window.POV_T || T;
    var it = ITEMS[idx];
    var kids = Array.prototype.slice.call(binsEl.children);
    kids.forEach(function (b) {
      b.textContent = T("d.bin." + b.dataset.bin);
      b.classList.remove("is-right", "is-wrong");
    });
    prog.textContent = T("d.prog", { n: idx + 1, t: ITEMS.length, s: score });

    if (finished) {
      art.innerHTML = "";
      name.textContent = T("d.done");
      hint.textContent = T("d.sum", { s: score, t: ITEMS.length });
      fb.className = "feedback ok";
      fb.textContent = score === ITEMS.length ? T("d.perfect") : T("d.retry");
      kids.forEach(function (b) { b.disabled = true; });
      next.hidden = false;
      next.textContent = T("d.again");
      return;
    }

    art.innerHTML = it.art;
    name.textContent = T("d." + it.id + ".n");
    hint.textContent = T("d." + it.id + ".h");

    if (!answered) {
      fb.className = "feedback";
      fb.textContent = T("d.pick");
      kids.forEach(function (b) { b.disabled = false; });
      next.hidden = true;
      return;
    }
    var ok = choice === it.answer;
    kids.forEach(function (b) {
      b.disabled = true;
      if (b.dataset.bin === it.answer) b.classList.add("is-right");
      if (b.dataset.bin === choice && !ok) b.classList.add("is-wrong");
    });
    fb.className = "feedback " + (ok ? "ok" : "no");
    fb.textContent = T(ok ? "d.ok" : "d.no") + T("d." + it.id + ".w");
    next.hidden = false;
    next.textContent = idx === ITEMS.length - 1 ? T("d.see") : T("d.next");
  }

  function choose(id) {
    if (answered || finished) return;
    answered = true;
    choice = id;
    if (id === ITEMS[idx].answer) score++;
    paint();
  }

  next.addEventListener("click", function () {
    if (finished) { finished = false; idx = 0; score = 0; answered = false; choice = null; paint(); return; }
    if (idx === ITEMS.length - 1) { finished = true; paint(); return; }
    idx++; answered = false; choice = null; paint();
  });

  // Tabs
  var tabs = document.querySelectorAll(".tab");
  Array.prototype.forEach.call(tabs, function (t) {
    t.addEventListener("click", function () {
      Array.prototype.forEach.call(tabs, function (o) {
        var on = o === t;
        o.setAttribute("aria-selected", on ? "true" : "false");
        $(o.getAttribute("aria-controls")).hidden = !on;
      });
    });
  });

  document.addEventListener("povlang", paint);
  paint();
})();


/* Scroll reveal + objectives spy */
(function () {
  "use strict";
  if (!("IntersectionObserver" in window)) return;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!reduce) {
    var vh = window.innerHeight;
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
    }, { threshold: 0.12 });
    document.querySelectorAll(".section-head, .objective, .partner, .fact, .challenge-copy, .step, .tl-row").forEach(function (el, i) {
      if (el.getBoundingClientRect().top < vh) return;
      el.classList.add("reveal");
      el.style.setProperty("--d", ((i % 3) * 70) + "ms");
      io.observe(el);
    });
  }

  var list = document.querySelector(".objectives");
  var nodes = document.querySelectorAll(".loop .node");
  var arc = document.querySelector(".loop-arc");
  var items = Array.prototype.slice.call(document.querySelectorAll(".objective"));
  if (!list || !nodes.length || !arc) return;
  var C = 879.65;
  function set(k) {
    list.classList.add("has-spy");
    items.forEach(function (li, i) { li.classList.toggle("is-active", i === k); });
    nodes.forEach(function (n, i) {
      n.classList.toggle("is-on", i <= k);
      n.classList.toggle("is-active", i === k);
    });
    arc.style.strokeDashoffset = String(C * (1 - k / 5));
  }
  var spy = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) set(items.indexOf(e.target)); });
  }, { rootMargin: "-42% 0px -50% 0px" });
  items.forEach(function (li) { spy.observe(li); });
})();
