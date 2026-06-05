(function () {
  var toggler = document.querySelector('.site-header.puttery-nav .navbar-toggler');
  var mobileMenu = document.querySelector('.mobile-expanded-menu');
  var submenuCarets = document.querySelectorAll('.mobile-expanded-menu .submenu-caret');
  var submenuBackLinks = document.querySelectorAll('.mobile-expanded-menu .menu-back-link');
  var dropdownItems = document.querySelectorAll('.site-header.puttery-nav .nav-item.dropdown');

  function setMobileMenuOpen(isOpen) {
    if (!mobileMenu || !toggler) return;
    mobileMenu.classList.toggle('is-open', isOpen);
    mobileMenu.setAttribute('aria-hidden', isOpen ? 'false' : 'true');
    toggler.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  }

  if (toggler && mobileMenu) {
    toggler.addEventListener('click', function () {
      setMobileMenuOpen(!mobileMenu.classList.contains('is-open'));
    });
  }

  submenuCarets.forEach(function (caret) {
    caret.addEventListener('click', function (event) {
      event.preventDefault();
      var targetId = caret.getAttribute('data-target');
      var submenu = targetId ? document.getElementById(targetId) : null;
      if (submenu) submenu.classList.add('is-active');
    });
  });

  submenuBackLinks.forEach(function (link) {
    link.addEventListener('click', function (event) {
      event.preventDefault();
      var submenu = link.closest('.submenu-wrapper');
      if (submenu) submenu.classList.remove('is-active');
    });
  });

  dropdownItems.forEach(function (item) {
    var toggle = item.querySelector('.dropdown-toggle-custom');
    if (!toggle) return;

    toggle.addEventListener('click', function (event) {
      if (window.matchMedia('(min-width: 1024px)').matches) return;
      event.preventDefault();
      var isOpen = item.classList.contains('is-open');
      dropdownItems.forEach(function (other) {
        other.classList.remove('is-open');
      });
      if (!isOpen) item.classList.add('is-open');
    });
  });

  document.addEventListener('click', function (event) {
    if (!event.target.closest('.nav-item.dropdown')) {
      dropdownItems.forEach(function (item) {
        item.classList.remove('is-open');
      });
    }

    if (
      mobileMenu &&
      mobileMenu.classList.contains('is-open') &&
      !event.target.closest('.mobile-expanded-menu') &&
      !event.target.closest('.navbar-toggler')
    ) {
      setMobileMenuOpen(false);
    }
  });

  window.addEventListener('resize', function () {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      setMobileMenuOpen(false);
      document.querySelectorAll('.submenu-wrapper.is-active').forEach(function (submenu) {
        submenu.classList.remove('is-active');
      });
    }
  });
})();
