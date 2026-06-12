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

  function getExcerptGapPx(content) {
    var gapValue = getComputedStyle(content).getPropertyValue('--v2-excerpt-gap').trim();
    if (!gapValue) return 48;

    var probe = document.createElement('div');
    probe.style.cssText = 'position:absolute;visibility:hidden;width:' + gapValue + ';';
    document.body.appendChild(probe);
    var gapPx = probe.offsetWidth;
    document.body.removeChild(probe);
    return gapPx || 48;
  }

  function getTitleTextRight(title) {
    var maxRight = 0;
    var range = document.createRange();

    Array.prototype.forEach.call(title.childNodes, function (node) {
      if (node.nodeType === 1 && node.classList.contains('visually-hidden')) return;

      if (node.nodeType === 3) {
        range.selectNodeContents(node);
      } else if (node.nodeType === 1) {
        range.selectNodeContents(node);
      } else {
        return;
      }

      Array.prototype.forEach.call(range.getClientRects(), function (rect) {
        maxRight = Math.max(maxRight, rect.right);
      });
    });

    return maxRight || title.getBoundingClientRect().right;
  }

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

    var gapPx = getExcerptGapPx(content);
    var contentRect = content.getBoundingClientRect();
    var titleTextRight = getTitleTextRight(title);
    var excerptRect = excerpt.getBoundingClientRect();
    var targetLeft = titleTextRight - contentRect.left + gapPx;
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

  function scheduleFitHeroExcerpt() {
    requestAnimationFrame(function () {
      fitHeroExcerpt();
    });
  }

  scheduleFitHeroExcerpt();
  window.addEventListener('resize', scheduleFitHeroExcerpt);
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(scheduleFitHeroExcerpt);
  }
})();
