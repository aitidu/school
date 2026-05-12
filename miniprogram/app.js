App({
  onLaunch() {
    wx.cloud.init({ env: 'your-env-id', traceUser: true });
  }
});
