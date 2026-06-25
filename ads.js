(function(){
  const ADS = {
    default: {
      label: 'Sponsor Slot',
      title: '赞助位预留：本地 AI 硬件 / 云 GPU / AI 工具',
      body: '上线初期建议只放一个低干扰广告位，优先选择和本地 AI Agent 强相关的赞助商。',
      cta: '查看合作方式',
      href: 'advertise.html'
    },
    'diagnose-sidebar': {
      label: 'Conversion Slot',
      title: '一对一配置诊断',
      body: '适合放付费诊断、模板包或云 GPU 临时方案。用户报错时转化意图更强。',
      cta: '了解合作',
      href: 'advertise.html'
    },
    'guide-affiliate': {
      label: 'Affiliate Slot',
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
