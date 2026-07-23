/* Shared behavior: mobile nav, scroll reveal, stat counters, contact form */
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
})();
