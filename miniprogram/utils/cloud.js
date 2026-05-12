function callFunction(name, data = {}) {
  return new Promise((resolve, reject) => {
    wx.showLoading({ title: '请稍候…', mask: true });
    wx.cloud
      .callFunction({ name, data })
      .then((res) => {
        wx.hideLoading();
        if (res.result && res.result.code === 0) {
          resolve(res.result.data);
        } else {
          const msg = (res.result && res.result.msg) || '请求失败';
          wx.showToast({ title: msg, icon: 'none' });
          reject(res.result);
        }
      })
      .catch((err) => {
        wx.hideLoading();
        const msg = (err && err.errMsg) || '网络异常，请稍后重试';
        if (msg.includes('permission')) {
          wx.showToast({ title: '权限不足', icon: 'none' });
        } else if (msg.includes('timeout')) {
          wx.showToast({ title: '请求超时', icon: 'none' });
        } else {
          wx.showToast({ title: msg, icon: 'none' });
        }
        reject(err);
      });
  });
}

module.exports = { callFunction };
