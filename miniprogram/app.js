const { callFunction } = require('./utils/cloud');

App({
  globalData: {
    userInfo: null
  },

  onLaunch() {
    wx.cloud.init({ env: 'your-env-id', traceUser: true });
    this.doLogin();
  },

  doLogin() {
    callFunction('userLogin')
      .then((user) => {
        this.globalData.userInfo = user;
        if (this.userReadyCallback) {
          this.userReadyCallback(user);
        }
      })
      .catch(() => {
        wx.showModal({
          title: '提示',
          content: '登录失败，请检查网络后重试',
          showCancel: false,
          confirmText: '知道了',
          success() {
            wx.exitMiniProgram();
          }
        });
      });
  }
});
