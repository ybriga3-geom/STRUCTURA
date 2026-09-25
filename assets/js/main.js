document.addEventListener('DOMContentLoaded', function () {
  /* nav mobile */
  var toggle = document.querySelector('.nav-toggle');
  var nav = document.querySelector('.main-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
    nav.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { nav.classList.remove('open'); });
    });
  }

  /* formulaire de contact */
  var form = document.getElementById('contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var btn = form.querySelector('button[type="submit"]');
      var original = btn.textContent;
      btn.textContent = 'Message envoyé';
      btn.disabled = true;
      form.reset();
      setTimeout(function () { btn.textContent = original; btn.disabled = false; }, 3200);
    });
  }

  /* accordéon des expertises */
  document.querySelectorAll('.sr-head').forEach(function (head) {
    head.addEventListener('click', function () {
      var row = head.closest('.service-row');
      var wasOpen = row.classList.contains('open');
      row.parentNode.querySelectorAll('.service-row.open').forEach(function (r) { r.classList.remove('open'); });
      if (!wasOpen) row.classList.add('open');
    });
  });

  /* diagnostic interactif */
  var diag = document.getElementById('diag');
  if (diag) {
    var results = {};
    try { results = JSON.parse(diag.getAttribute('data-results') || '{}'); } catch (e) { results = {}; }
    var ctaLabel = diag.getAttribute('data-cta') || 'View this expertise';
    var opts = diag.querySelectorAll('.diag-opt');
    var resultBox = diag.querySelector('.diag-result');
    var resetBtn = diag.querySelector('.diag-reset');
    opts.forEach(function (opt) {
      opt.addEventListener('click', function () {
        opts.forEach(function (o) { o.classList.remove('selected'); });
        opt.classList.add('selected');
        var key = opt.getAttribute('data-key');
        var r = results[key];
        if (!r) return;
        resultBox.innerHTML =
          '<span class="dr-tag" style="background:' + r.color + '22;color:' + r.color + ';">' + r.tag + '</span>' +
          '<h4>' + r.title + '</h4>' +
          '<p>' + r.text + '</p>' +
          '<a href="' + r.link + '" class="btn btn-primary">' + ctaLabel + '</a>';
        resultBox.classList.add('show');
      });
    });
    if (resetBtn) {
      resetBtn.addEventListener('click', function () {
        opts.forEach(function (o) { o.classList.remove('selected'); });
        resultBox.classList.remove('show');
        resultBox.innerHTML = '';
      });
    }
  }

  /* compteurs animés (un seul déclenchement au scroll) */
  var counters = document.querySelectorAll('.cnum[data-target]');
  if (counters.length && 'IntersectionObserver' in window) {
    var seen = new WeakSet();
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !seen.has(entry.target)) {
          seen.add(entry.target);
          animateCounter(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (c) { obs.observe(c); });
  }
  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-target'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 900;
    var start = null;
    function step(ts) {
      if (!start) start = ts;
      var progress = Math.min((ts - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = Math.round(target * eased);
      el.textContent = val + '';
      if (suffix) el.innerHTML = val + '<span class="suffix">' + suffix + '</span>';
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
});

/* popup de sélection de langue (page d'accueil uniquement) */
document.addEventListener('DOMContentLoaded', function () {
  var overlay = document.getElementById('lang-modal-overlay');
  if (!overlay) return;
  var already = localStorage.getItem('atlas_lang_prompted');
  if (!already) {
    overlay.hidden = false;
  }
  function dismiss() {
    localStorage.setItem('atlas_lang_prompted', '1');
    overlay.hidden = true;
  }
  var skipBtn = overlay.querySelector('.lm-skip');
  if (skipBtn) skipBtn.addEventListener('click', dismiss);
  overlay.querySelectorAll('.lm-opt').forEach(function (a) {
    a.addEventListener('click', function () { localStorage.setItem('atlas_lang_prompted', '1'); });
  });
  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) dismiss();
  });
});
