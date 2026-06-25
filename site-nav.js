(function () {
  var inGuides = /\/guides\//.test(location.pathname);
  var root = inGuides ? '../' : '';
  var guideHref = inGuides ? 'index.html' : root + 'guides/index.html';

  var links = [
    { href: root + 'local-agent-wizard.html', label: '开始生成' },
    { href: root + 'templates.html', label: '模板包' },
    { href: root + 'integrations.html', label: '服务升级' },
    { href: root + 'diagnose.html', label: '报错诊断' },
    { href: guideHref, label: '教程' },
    { href: root + 'pricing.html', label: '定价' }
  ];

  document.querySelectorAll('.nav .brand').forEach(function (el) {
    el.href = root + 'index.html';
  });

  document.querySelectorAll('.nav-links').forEach(function (el) {
    el.innerHTML = links.map(function (l) {
      return '<a href="' + l.href + '">' + l.label + '</a>';
    }).join('');
  });

  document.querySelectorAll('.topbar-actions').forEach(function (el) {
    var kept = Array.prototype.filter.call(el.children, function (node) {
      return !node.classList.contains('topbar-link');
    });
    var html = links.map(function (l) {
      return '<a class="topbar-link" href="' + l.href + '">' + l.label + '</a>';
    }).join('');
    kept.forEach(function (node) {
      html += node.outerHTML;
    });
    el.innerHTML = html;
  });
})();
