/* ================================================================
   nav.js — Navbar compartilhada, Grupo Fly
   Scroll shadow, dropdowns desktop, accordion mobile, scroll-spy.
================================================================ */
(function () {
  function init() {
    var nav = document.getElementById('nav');
    if (!nav) return;

    /* ── Scroll shadow ── */
    function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 24); }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* ── Dropdowns desktop (.nav__item > .nav__top-link + .nav__dropdown) ── */
    var items = Array.prototype.slice.call(nav.querySelectorAll('.nav__item'));

    function closeAllItems(except) {
      items.forEach(function (item) {
        if (item === except) return;
        item.classList.remove('is-open');
        var trigger = item.querySelector('.nav__top-link');
        if (trigger) trigger.setAttribute('aria-expanded', 'false');
      });
    }

    items.forEach(function (item) {
      var trigger = item.querySelector('.nav__top-link');
      if (!trigger) return;
      trigger.addEventListener('click', function (e) {
        e.stopPropagation();
        var willOpen = !item.classList.contains('is-open');
        closeAllItems(willOpen ? item : null);
        item.classList.toggle('is-open', willOpen);
        trigger.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      });
      item.querySelectorAll('.nav__dropdown a').forEach(function (a) {
        a.addEventListener('click', function () { closeAllItems(null); });
      });
    });

    document.addEventListener('click', function (e) {
      if (!nav.contains(e.target)) closeAllItems(null);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeAllItems(null);
    });
    window.addEventListener('resize', function () { closeAllItems(null); });

    /* ── Burger (mobile slide-down) ── */
    var burger = document.getElementById('nav-burger');
    var mobile = document.getElementById('nav-mobile');
    var iconMenu = document.getElementById('icon-menu');
    var iconX = document.getElementById('icon-x');

    if (burger && mobile) {
      var menuOpen = false;
      function setMenuOpen(open) {
        menuOpen = open;
        mobile.classList.toggle('open', open);
        if (iconMenu) iconMenu.style.display = open ? 'none' : '';
        if (iconX) iconX.style.display = open ? '' : 'none';
      }
      burger.addEventListener('click', function () { setMenuOpen(!menuOpen); });

      /* ── Accordion (.nav__mobile-group) ── */
      var groups = Array.prototype.slice.call(mobile.querySelectorAll('.nav__mobile-group'));
      groups.forEach(function (group) {
        var toggle = group.querySelector('.nav__mobile-group-toggle');
        if (!toggle) return;
        toggle.addEventListener('click', function () {
          var willOpen = !group.classList.contains('open');
          groups.forEach(function (g) {
            g.classList.remove('open');
            var t = g.querySelector('.nav__mobile-group-toggle');
            if (t) t.setAttribute('aria-expanded', 'false');
          });
          group.classList.toggle('open', willOpen);
          toggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
        });
      });
      var currentGroup = mobile.querySelector('.nav__mobile-group.is-current');
      if (currentGroup) currentGroup.classList.add('open');

      mobile.querySelectorAll('a').forEach(function (a) {
        a.addEventListener('click', function () { setMenuOpen(false); });
      });
    }

    /* ── Scroll-spy: marca o link ativo conforme a seção visível ── */
    var spyLinks = Array.prototype.slice.call(
      nav.querySelectorAll('.nav__dropdown a[href^="#"], .nav__mobile-group-panel a[href^="#"]')
    );
    var spySections = spyLinks.map(function (a) {
      return document.getElementById(a.getAttribute('href').slice(1));
    }).filter(Boolean);

    if (spySections.length) {
      function setActive(id) {
        spyLinks.forEach(function (a) {
          a.classList.toggle('nav__link--active', a.getAttribute('href') === '#' + id);
        });
      }
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) setActive(e.target.id);
        });
      }, { rootMargin: '-30% 0px -60% 0px', threshold: 0 });
      spySections.forEach(function (s) { spy.observe(s); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
