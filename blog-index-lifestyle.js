(function () {
  var categoryNav = document.getElementById('category-nav');
  var postGrid = document.getElementById('post-grid');
  var inlineCtaBook = document.getElementById('inline-cta-book');

  function getActiveLocationUrl() {
    var locationLink = document.querySelector('.site-header.puttery-nav .active-location a');
    return locationLink ? locationLink.href : 'https://www.puttery.com/locations/';
  }

  function syncBookNowUrl() {
    if (!inlineCtaBook) return;
    inlineCtaBook.href = getActiveLocationUrl();
  }

  if (categoryNav && postGrid) {
    var pills = categoryNav.querySelectorAll('.category-pill[data-category]');
    var cards = postGrid.querySelectorAll('.post-card[data-category]');

    function setActivePill(active) {
      pills.forEach(function (pill) {
        var isActive = pill === active;
        pill.classList.toggle('is-active', isActive);
        pill.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });
    }

    function filterByCategory(category) {
      cards.forEach(function (card) {
        var match = category === 'all' || card.getAttribute('data-category') === category;
        card.classList.toggle('is-hidden', !match);
      });
    }

    pills.forEach(function (pill) {
      pill.addEventListener('click', function () {
        setActivePill(pill);
        filterByCategory(pill.getAttribute('data-category'));
      });
    });

    var initialActive = categoryNav.querySelector('.category-pill.is-active[data-category]');
    if (initialActive) {
      filterByCategory(initialActive.getAttribute('data-category'));
    }
  }

  syncBookNowUrl();
})();
