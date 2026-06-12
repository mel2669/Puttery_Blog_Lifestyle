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

  var EXCERPT_GAP_PX = 48;

  function fitHeroExcerpt() {
    var content = document.querySelector('.blog-index-v2 .hero__content');
    var title = document.querySelector('.blog-index-v2 .hero__title');
    var excerpt = document.querySelector('.blog-index-v2 .hero__excerpt');
    var body = document.querySelector('.blog-index-v2 .hero__excerpt-body');
    if (!content || !title || !excerpt || !body) return;

    var fullText = body.getAttribute('data-full-text') || body.textContent.trim();
    body.setAttribute('data-full-text', fullText);
    body.textContent = fullText;
    excerpt.style.maxHeight = '';
    excerpt.style.marginLeft = '';
    excerpt.style.width = '';

    if (window.innerWidth < 768) return;

    var contentRect = content.getBoundingClientRect();
    var titleRect = title.getBoundingClientRect();
    var excerptRect = excerpt.getBoundingClientRect();
    var targetLeft = titleRect.right - contentRect.left + EXCERPT_GAP_PX;
    var shift = targetLeft - (excerptRect.left - contentRect.left);
    var rightEdge = excerptRect.right - contentRect.left;

    excerpt.style.marginLeft = Math.round(shift) + 'px';
    excerpt.style.width = Math.max(0, Math.round(rightEdge - targetLeft)) + 'px';
    excerpt.style.maxHeight = title.offsetHeight + 'px';

    if (excerpt.scrollHeight <= title.offsetHeight) return;

    var words = fullText.split(/\s+/);
    while (words.length > 1 && excerpt.scrollHeight > title.offsetHeight) {
      words.pop();
      body.textContent = words.join(' ') + '…';
    }
  }

  fitHeroExcerpt();
  window.addEventListener('resize', fitHeroExcerpt);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(fitHeroExcerpt);
  }
})();
