(function () {
  var inGuides = /\/guides\//.test(location.pathname);
  var root = inGuides ? '../' : '';
  var origin = location.origin === 'file://' ? 'https://tool-nu-bay.vercel.app' : location.origin;
  var cleanPath = location.pathname.endsWith('/') ? location.pathname : location.pathname.replace(/\/index\.html$/, '/');
  var canonicalUrl = origin + cleanPath;

  if (!document.querySelector('link[rel="icon"]')) {
    var icon = document.createElement('link');
    icon.rel = 'icon';
    icon.href = root + 'favicon.svg';
    icon.type = 'image/svg+xml';
    document.head.appendChild(icon);
  }

  if (!document.querySelector('link[rel="manifest"]')) {
    var manifest = document.createElement('link');
    manifest.rel = 'manifest';
    manifest.href = root + 'manifest.webmanifest';
    document.head.appendChild(manifest);
  }

  if (!document.querySelector('meta[name="theme-color"]')) {
    var theme = document.createElement('meta');
    theme.name = 'theme-color';
    theme.content = '#4fb3a8';
    document.head.appendChild(theme);
  }

  var canonical = document.querySelector('link[rel="canonical"]');
  if (canonical) canonical.href = canonicalUrl;

  function ensureMeta(selector, attrs) {
    var el = document.querySelector(selector);
    if (!el) {
      el = document.createElement('meta');
      Object.keys(attrs).forEach(function (key) { el.setAttribute(key, attrs[key]); });
      document.head.appendChild(el);
    }
    return el;
  }

  ensureMeta('meta[property="og:url"]', {property: 'og:url', content: canonicalUrl}).content = canonicalUrl;
  ensureMeta('meta[property="og:image"]', {property: 'og:image', content: origin + '/assets/hero-dashboard.png'}).content = origin + '/assets/hero-dashboard.png';
  ensureMeta('meta[name="twitter:card"]', {name: 'twitter:card', content: 'summary_large_image'});

  if (!document.querySelector('script[data-site-schema]')) {
    var schema = document.createElement('script');
    schema.type = 'application/ld+json';
    schema.setAttribute('data-site-schema', 'true');
    schema.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'SoftwareApplication',
      name: 'Local Agent Wizard',
      applicationCategory: 'ProductivityApplication',
      operatingSystem: 'macOS, Windows, Linux',
      url: canonicalUrl,
      image: origin + '/assets/hero-dashboard.png',
      offers: {'@type': 'Offer', price: '0', priceCurrency: 'USD'}
    });
    document.head.appendChild(schema);
  }

  if ('serviceWorker' in navigator && location.protocol === 'https:') {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register(root + 'service-worker.js').catch(function () {});
    });
  }
})();
