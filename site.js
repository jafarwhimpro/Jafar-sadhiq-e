/* Shared behavior: mobile nav, scroll reveal, stat counters, contact form,
   live studio projects (fetched from whimpro.com) */
(function () {
  'use strict';

  /* mobile nav */
  var toggle = document.querySelector('.nav-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      document.body.classList.toggle('nav-open');
    });
    document.querySelectorAll('.nav-links a').forEach(function (a) {
      a.addEventListener('click', function () { document.body.classList.remove('nav-open'); });
    });
  }

  /* scroll reveal */
  var items = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -30px 0px' });
    items.forEach(function (n) { io.observe(n); });
    setTimeout(function () { items.forEach(function (n) { n.classList.add('visible'); }); }, 1500);
  } else {
    items.forEach(function (n) { n.classList.add('visible'); });
  }

  /* animated counters (projects page) */
  document.querySelectorAll('.count').forEach(function (counter) {
    var target = Number(counter.getAttribute('data-target')) || 0;
    var current = 0;
    var step = Math.max(1, Math.round(target / 38));
    (function tick() {
      current = Math.min(target, current + step);
      counter.textContent = current + '+';
      if (current < target) requestAnimationFrame(tick);
    })();
  });

  /* contact form → opens WhatsApp with the enquiry prefilled */
  var form = document.querySelector('.contact-form');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (name) { return (form.elements[name] && form.elements[name].value || '').trim(); };
      var msg =
        'Hi Jafar, new project enquiry:\n' +
        'Name: ' + v('name') + '\n' +
        'Phone: ' + v('phone') + '\n' +
        (v('email') ? 'Email: ' + v('email') + '\n' : '') +
        'Project type: ' + v('project-type') + '\n' +
        'Message: ' + v('message');
      window.open('https://wa.me/919526665443?text=' + encodeURIComponent(msg), '_blank');
    });
  }

  /* ---- Studio projects — live from whimpro.com ----
     Any element with [data-projects-grid] gets the published Whimpro
     projects rendered as cards linking to the main site. The static
     markup already inside the element is the fallback (kept when the
     fetch fails or JS is off), so the page never renders empty. */
  var WHIMPRO_BASE = 'https://whimpro.com';
  var grids = document.querySelectorAll('[data-projects-grid]');
  if (grids.length && window.fetch) {
    var esc = function (s) {
      return String(s == null ? '' : s)
        .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
    };
    var coverUrl = function (p) {
      var src = String(p.cover_image || '');
      if (!src) return '';
      return /^https?:\/\//i.test(src) ? src : WHIMPRO_BASE + '/' + src.replace(/^\//, '');
    };
    var cardHTML = function (p) {
      var url = WHIMPRO_BASE + '/project.html?slug=' + encodeURIComponent(p.slug);
      var pos = (p.cover_position === 'top' || p.cover_position === 'bottom')
        ? ' style="object-position:center ' + p.cover_position + '"' : '';
      return '' +
        '<a class="project-card" href="' + esc(url) + '">' +
          '<span class="project-card-media">' +
            (p.category ? '<span class="tag">' + esc(p.category) + '</span>' : '') +
            '<img src="' + esc(coverUrl(p)) + '" alt="' + esc(p.title) + '" loading="lazy"' + pos + '>' +
          '</span>' +
          '<span class="project-card-body">' +
            (p.location ? '<span class="project-card-loc">' + esc(p.location) + '</span>' : '') +
            '<strong>' + esc(p.title) + '</strong>' +
            '<span class="project-card-more">View on Whimpro &rarr;</span>' +
          '</span>' +
        '</a>';
    };
    fetch(WHIMPRO_BASE + '/data/projects.json', { cache: 'no-store' })
      .then(function (r) { if (!r.ok) throw new Error('data ' + r.status); return r.json(); })
      .then(function (list) {
        list = (list || [])
          .filter(function (p) { return p && p.published !== false && p.slug && p.title; })
          .sort(function (a, b) { return (a.sort_order || 0) - (b.sort_order || 0); });
        if (!list.length) return; /* keep the static fallback */
        grids.forEach(function (grid) {
          var limit = Number(grid.getAttribute('data-limit')) || 0;
          var items = limit > 0 ? list.slice(0, limit) : list;
          grid.innerHTML = items.map(cardHTML).join('');
        });
      })
      .catch(function () { /* fetch failed — static fallback stays in place */ });
  }
})();
