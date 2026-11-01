/* Minecity Roleplay Wiki - client runtime */
(function () {
  "use strict";

  /* ------------------------------------------------ theme */
  var root = document.documentElement;
  var saved = null;
  try { saved = localStorage.getItem("mcrp-theme"); } catch (e) {}
  if (saved) root.setAttribute("data-theme", saved);

  var themeBtn = document.getElementById("themeBtn");
  if (themeBtn) {
    themeBtn.addEventListener("click", function () {
      var next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
      root.setAttribute("data-theme", next);
      try { localStorage.setItem("mcrp-theme", next); } catch (e) {}
    });
  }

  /* ------------------------------------------------ mobile nav */
  var sidebar = document.getElementById("sidebar");
  var scrim = document.getElementById("scrim");
  var menuBtn = document.getElementById("menuBtn");

  function closeNav() {
    if (sidebar) sidebar.classList.remove("open");
    if (scrim) scrim.classList.remove("show");
  }
  if (menuBtn) {
    menuBtn.addEventListener("click", function () {
      sidebar.classList.toggle("open");
      scrim.classList.toggle("show");
    });
  }
  if (scrim) scrim.addEventListener("click", closeNav);
  if (sidebar) {
    sidebar.addEventListener("click", function (e) {
      if (e.target.closest("a") && window.innerWidth <= 1024) closeNav();
    });
  }

  /* ------------------------------------------------ search */
  var modal = document.getElementById("searchModal");
  var input = document.getElementById("searchInput");
  var results = document.getElementById("searchResults");
  var data = null;
  var loading = false;
  var sel = 0;

  function loadIndex(cb) {
    if (data) return cb();
    if (window.MCRP_SEARCH) {
      data = window.MCRP_SEARCH;
      return cb();
    }
    if (loading) return;
    loading = true;
    fetch("assets/search.json")
      .then(function (r) { return r.json(); })
      .then(function (json) {
        data = json;
        loading = false;
        cb();
      })
      .catch(function () {
        loading = false;
        results.innerHTML = '<div class="sr-empty">Search index unavailable.</div>';
      });
  }

  function openSearch() {
    if (!modal) return;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
    loadIndex(function () { input.focus(); render(input.value); });
  }

  function closeSearch() {
    if (!modal) return;
    modal.hidden = true;
    document.body.style.overflow = "";
  }

  function score(item, q) {
    var t = (item.t || "").toLowerCase();
    var h = (item.h || "").toLowerCase();
    var x = (item.x || "").toLowerCase();
    var s = 0;
    if (!q) return 1;
    if (t.indexOf(q) === 0) s += 60;
    else if (t.indexOf(q) > -1) s += 30;
    if (h.indexOf(q) === 0) s += 40;
    else if (h.indexOf(q) > -1) s += 20;
    if (x.indexOf(q) > -1) s += 6;
    // every token must match somewhere
    var toks = q.split(/\s+/).filter(Boolean);
    for (var i = 0; i < toks.length; i++) {
      if (t.indexOf(toks[i]) === -1 && h.indexOf(toks[i]) === -1 && x.indexOf(toks[i]) === -1) return 0;
    }
    return s;
  }

  function render(q) {
    if (!data) return;
    q = (q || "").trim().toLowerCase();
    var hits = [];
    for (var i = 0; i < data.length; i++) {
      var sc = score(data[i], q);
      if (sc > 0) hits.push({ item: data[i], sc: sc });
    }
    hits.sort(function (a, b) { return b.sc - a.sc; });
    var top = hits.slice(0, 14);

    if (!top.length) {
      results.innerHTML = '<div class="sr-empty">No results for “' + q.replace(/[<>&]/g, "") + '”</div>';
      return;
    }
    sel = 0;
    var html = "";
    for (var j = 0; j < top.length; j++) {
      var it = top[j].item;
      var href = it.s + ".html" + (it.a ? "#" + it.a : "");
      var snippet = (it.x || "").slice(0, 110);
      html +=
        '<a class="sr-item' + (j === 0 ? " sel" : "") + '" href="' + href + '">' +
        "<b>" + esc(it.t) + (it.h ? ' <span style="color:var(--muted);font-weight:400">› ' + esc(it.h) + "</span>" : "") + "</b>" +
        "<small>" + esc(it.s) + "</small>" +
        (snippet ? "<p>" + esc(snippet) + "…</p>" : "") +
        "</a>";
    }
    results.innerHTML = html;
  }

  function esc(s) {
    return String(s).replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function move(dir) {
    var items = results.querySelectorAll(".sr-item");
    if (!items.length) return;
    items[sel].classList.remove("sel");
    sel = (sel + dir + items.length) % items.length;
    items[sel].classList.add("sel");
    items[sel].scrollIntoView({ block: "nearest" });
  }

  if (input) {
    input.addEventListener("input", function () { render(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "ArrowDown") { e.preventDefault(); move(1); }
      else if (e.key === "ArrowUp") { e.preventDefault(); move(-1); }
      else if (e.key === "Enter") {
        var items = results.querySelectorAll(".sr-item");
        if (items[sel]) window.location.href = items[sel].getAttribute("href");
      }
    });
  }

  if (modal) {
    modal.addEventListener("click", function (e) {
      if (e.target === modal) closeSearch();
    });
  }

  document.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      openSearch();
    } else if (e.key === "Escape") {
      closeSearch();
      closeNav();
    }
  });

  Array.prototype.forEach.call(document.querySelectorAll("[data-open-search]"), function (b) {
    b.addEventListener("click", openSearch);
  });

  /* ------------------------------------------------ copy commands */
  document.addEventListener("click", function (e) {
    var code = e.target.closest("td.cmd code");
    if (!code) return;
    var text = code.textContent;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function () {
        var old = code.getAttribute("data-orig");
        if (!old) code.setAttribute("data-orig", code.textContent);
        code.textContent = "copied!";
        setTimeout(function () { code.textContent = text; }, 900);
      });
    }
  });

  /* ------------------------------------------------ toc scrollspy */
  var tocLinks = document.querySelectorAll(".toc a");
  if (tocLinks.length && "IntersectionObserver" in window) {
    var map = {};
    Array.prototype.forEach.call(tocLinks, function (a) {
      map[a.getAttribute("href").slice(1)] = a;
    });
    var obs = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (en) {
          if (en.isIntersecting) {
            Array.prototype.forEach.call(tocLinks, function (a) { a.style.color = ""; a.style.borderLeftColor = ""; });
            var link = map[en.target.id];
            if (link) { link.style.color = "var(--text)"; link.style.borderLeftColor = "var(--accent)"; }
          }
        });
      },
      { rootMargin: "-80px 0px -70% 0px" }
    );
    Array.prototype.forEach.call(tocLinks, function (a) {
      var el = document.getElementById(a.getAttribute("href").slice(1));
      if (el) obs.observe(el);
    });
  }
})();
