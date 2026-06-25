(function(){
  window.lawTrack = function(eventName, payload){
    const item = {
      event: eventName,
      payload: payload || {},
      path: location.pathname,
      ts: new Date().toISOString()
    };
    try {
      const key = 'law_events';
      const events = JSON.parse(localStorage.getItem(key) || '[]').slice(-100);
      events.push(item);
      localStorage.setItem(key, JSON.stringify(events));
    } catch (_) {}
    if (location.search.includes('debug_analytics=1')) {
      console.log('[LocalAgentWizard]', item);
    }
  };
  window.lawTrack('page_view', {title: document.title});
  document.addEventListener('click', event => {
    const link = event.target.closest('a,button');
    if(!link) return;
    const label = link.textContent.trim().slice(0,80);
    window.lawTrack('click', {label, href: link.getAttribute('href') || ''});
  });
})();
