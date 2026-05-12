const api = require('../../utils/api');
const app = getApp();

Page({
  data: { statusText: '正在分析你的答案...', error: false },

  onLoad() {
    this.submit();
  },

  submit() {
    this.setData({ error: false, statusText: '正在分析你的答案...' });

    const answers = app.globalData.quizAnswers;
    if (!answers || Object.keys(answers).length === 0) {
      this.setData({ statusText: '未收到答案数据', error: true });
      return;
    }

    api.submitQuiz(answers).then(result => {
      wx.redirectTo({ url: `/pages/report/report?id=${result.reportId}` });
    }).catch(() => {
      this.setData({ statusText: '网络不稳定，请重试', error: true });
    });
  },

  retry() {
    this.submit();
  },
});
