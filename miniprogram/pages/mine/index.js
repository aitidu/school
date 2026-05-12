const app = getApp();

Page({
  data: {
    user: null
  },

  onLoad() {
    this.loadUser();
  },

  onShow() {
    if (app.globalData.userInfo) {
      this.setData({ user: app.globalData.userInfo });
    }
  },

  loadUser() {
    const user = app.globalData.userInfo;
    if (user) {
      this.setData({ user });
    } else {
      app.userReadyCallback = (user) => {
        this.setData({ user });
      };
    }
  },

  goToMyRepairs() {
    wx.navigateTo({ url: '/pages/repair/list' });
  },

  goToRepairManage() {
    wx.navigateTo({ url: '/pages/manager/repairManage/list' });
  },

  goToAuth() {
    wx.navigateTo({ url: '/pages/mine/realnameAuth' });
  },

  goToEditProfile() {
    wx.navigateTo({ url: '/pages/mine/editProfile' });
  }
});
