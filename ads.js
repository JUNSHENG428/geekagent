(function(){
  const ADS = {
    default: {
      label: '推荐资源',
      title: '推荐资源：本地 AI 硬件 / 云 GPU / AI 工具',
      body: '这里会推荐与本地 AI Agent 相关的工具、课程、模板包或配置诊断服务。',
      cta: '查看合作方式',
      href: 'advertise.html'
    },
    'diagnose-sidebar': {
      label: '服务推荐',
      title: '一对一配置诊断',
      body: '如果自动诊断没有解决问题，可以查看模板包、人工诊断或临时云 GPU 方案。',
      cta: '了解合作',
      href: 'advertise.html'
    },
    'guide-affiliate': {
      label: '硬件推荐',
      title: '本地 AI 硬件推荐位',
      body: '可接 Mac mini、显卡、迷你主机、内存、SSD、云 GPU 等联盟链接。',
      cta: '投放广告',
      href: '../advertise.html'
    }
  };
  document.querySelectorAll('.ad-slot').forEach(slot => {
    const key = slot.dataset.adSlot || 'default';
    const ad = ADS[key] || ADS.default;
    slot.innerHTML = `<div class="ad-label">${ad.label}</div><h3>${ad.title}</h3><p>${ad.body}</p><p><a class="btn" href="${ad.href}">${ad.cta}</a></p>`;
  });
})();
