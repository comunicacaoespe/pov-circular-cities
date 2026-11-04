/* POV site: language switcher (EN, PL, EL, PT, HR). Text lives in i18n-data.js */
(function () {
  "use strict";
  var D = window.POV_I18N || {};
  var LANGS = ["en", "pl", "el", "pt", "hr"];
  var LOCALE = { en: "en-GB", pl: "pl-PL", el: "el-GR", pt: "pt-PT", hr: "hr-HR" };
  var cur = "en";

  function t(key, vars) {
    var s = (D[cur] && D[cur][key]) || (D.en && D.en[key]) || key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }

  function monthYear(i) {
    try { return new Intl.DateTimeFormat(LOCALE[cur], { month: "short", year: "numeric" }).format(new Date(2026, 8 + i, 1)); }
    catch (e) { return ""; }
  }

  function apply(lang) {
    if (LANGS.indexOf(lang) < 0) lang = "en";
    cur = lang;
    window.POV_LANG = lang;
    document.documentElement.lang = lang;

    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n]"), function (el) {
      el.innerHTML = t(el.getAttribute("data-i18n"));
    });
    Array.prototype.forEach.call(document.querySelectorAll("[data-i18n-attr]"), function (el) {
      el.getAttribute("data-i18n-attr").split(";").forEach(function (pair) {
        var p = pair.split(":");
        if (p.length === 2) el.setAttribute(p[0], t(p[1]));
      });
    });
    Array.prototype.forEach.call(document.querySelectorAll(".g-track"), function (tr) {
      var a = +tr.getAttribute("data-a"), b = +tr.getAttribute("data-b");
      var label = tr.previousElementSibling ? tr.previousElementSibling.textContent : "";
      var range = monthYear(a) + " – " + monthYear(b);
      tr.setAttribute("aria-label", label + ": " + range);
      var bar = tr.firstElementChild;
      if (bar) bar.setAttribute("title", range);
    });
    var meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.desc"));
    Array.prototype.forEach.call(document.querySelectorAll(".lang button"), function (b) {
      b.setAttribute("aria-pressed", b.getAttribute("data-lang") === lang ? "true" : "false");
    });
    document.dispatchEvent(new CustomEvent("povlang", { detail: lang }));
  }

  function pick() {
    var q = /[?&]lang=([a-z]{2})/.exec(location.search);
    if (q && LANGS.indexOf(q[1]) >= 0) return q[1];
    try { var s = localStorage.getItem("pov-lang"); if (s && LANGS.indexOf(s) >= 0) return s; } catch (e) {}
    var n = (navigator.language || "en").slice(0, 2).toLowerCase();
    return LANGS.indexOf(n) >= 0 ? n : "en";
  }

  window.POV_T = t;
  Array.prototype.forEach.call(document.querySelectorAll(".lang button"), function (b) {
    b.addEventListener("click", function () {
      var l = b.getAttribute("data-lang");
      try { localStorage.setItem("pov-lang", l); } catch (e) {}
      apply(l);
    });
  });
  apply(pick());
})();
