const api = require('../../utils/api');

Page({
  data: { reportId: '', report: {} },

  onLoad(options) {
    this.setData({ reportId: options.id });
    api.getReport(options.id).then(data => {
      const report = data.preview || data.content;
      // Always unlock to get full content
      if (!data.unlocked) {
        return api.unlockReport(options.id);
      }
      return data;
    }).then(data => {
      this.setData({ report: data.content || data.preview });
    }).catch(err => {
      console.error('加载报告失败:', err);
      wx.showToast({ title: '加载失败，下拉重试', icon: 'none' });
    });
  },

  retry() {
    wx.navigateBack({ delta: 2 });
  },

  onShareAppMessage() {
    const r = this.data.report;
    return {
      title: `我的爱情原型是「${r.archetype || '?'}」${r.emoji || ''}，来测测你的～`,
      path: '/pages/index/index',
    };
  },
});
