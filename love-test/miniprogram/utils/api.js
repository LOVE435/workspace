const app = getApp();

function request(path, options = {}) {
  const base = app.globalData.apiBase;
  return new Promise((resolve, reject) => {
    wx.request({
      url: `${base}${path}`,
      method: options.method || 'GET',
      data: options.data,
      header: { 'Content-Type': 'application/json' },
      success(res) {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve(res.data);
        } else {
          reject(res.data);
        }
      },
      fail(err) {
        reject(err);
      },
    });
  });
}

module.exports = {
  submitQuiz(answers) {
    return request('/api/quiz/submit', {
      method: 'POST',
      data: { answers },
    });
  },
  getReport(id) {
    return request(`/api/report/${id}`);
  },
  unlockReport(id) {
    return request(`/api/report/${id}/unlock`, { method: 'POST' });
  },
};
