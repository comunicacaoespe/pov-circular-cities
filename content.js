/* POV site: renders news, contacts and data controller from content.json (edited in /admin). */
(function () {
  "use strict";
  var data = null, LOCALE = { en: "en-GB", pl: "pl-PL", el: "el-GR", pt: "pt-PT", hr: "hr-HR" };
  function lang() { return window.POV_LANG || "en"; }
  function T(k) { var D = window.POV_I18N || {}; return (D[lang()] && D[lang()][k]) || (D.en && D.en[k]) || ""; }
  function pick(o) { o = o || {}; return o[lang()] || o.en || o.pt || o.pl || o.el || o.hr || ""; }
  function el(tag, cls, txt) { var e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; }
  function fmt(d) {
    try { return new Intl.DateTimeFormat(LOCALE[lang()], { day: "numeric", month: "long", year: "numeric" }).format(new Date(d + "T12:00:00")); }
    catch (e) { return d; }
  }

  function news() {
    var list = document.getElementById("news-list"), empty = document.querySelector(".news-empty");
    if (!list) return;
    var items = (data.news || []).filter(function (n) { return pick(n.title) || pick(n.text); })
      .sort(function (a, b) { return a.date < b.date ? 1 : -1; });
    list.innerHTML = "";
    if (!items.length) { list.hidden = true; if (empty) empty.hidden = false; return; }
    if (empty) empty.hidden = true;
    list.hidden = false;
    items.forEach(function (n) {
      var a = el("article", "news-card");
      var t = el("time", "news-date", fmt(n.date)); t.setAttribute("datetime", n.date); a.appendChild(t);
      a.appendChild(el("h3", "", pick(n.title)));
      pick(n.text).split(/\n\s*\n/).forEach(function (p) { if (p.trim()) a.appendChild(el("p", "", p.trim())); });
      if (n.link && /^https?:\/\//i.test(n.link)) {
        var l = el("a", "news-more", T("news.more")); l.href = n.link; l.rel = "noopener"; l.target = "_blank"; a.appendChild(l);
      }
      list.appendChild(a);
    });
  }

  function contacts() {
    var box = document.getElementById("foot-contact"); if (!box) return;
    var c = data.contacts || {}, ul = box.querySelector("ul"); ul.innerHTML = "";
    if (c.email) { var li = el("li"), a = el("a", "", c.email); a.href = "mailto:" + c.email; li.appendChild(a); ul.appendChild(li); }
    if (c.phone) { var l2 = el("li"), p = el("a", "", c.phone); p.href = "tel:" + c.phone.replace(/[^\d+]/g, ""); l2.appendChild(p); ul.appendChild(l2); }
    if (c.address) ul.appendChild(el("li", "", c.address));
    box.hidden = !ul.children.length;
  }

  function controller() {
    var p = document.getElementById("pv-controller"); if (!p) return;
    var r = data.controller || {}, parts = [r.name, r.address, r.email].filter(Boolean);
    if (!r.name) { p.hidden = true; return; }
    p.textContent = T("pv.ctrl") + ": " + parts.join(", ") + ".";
    p.hidden = false;
  }

  function all() { if (data) { news(); contacts(); controller(); } }
  document.addEventListener("povlang", all);
  fetch("content.json", { cache: "no-cache" }).then(function (r) { return r.ok ? r.json() : null; })
    .then(function (d) { if (d) { data = d; all(); } }).catch(function () {});
})();
