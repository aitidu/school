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

  goToLateReport() {
    wx.navigateTo({ url: '/pages/attendance/lateReport' });
  },

  goToLeaveRequest() {
    wx.navigateTo({ url: '/pages/attendance/leaveRequest' });
  },

  goToMyAttendance() {
    wx.navigateTo({ url: '/pages/attendance/myRecord' });
  },

  goToEditProfile() {
    wx.navigateTo({ url: '/pages/mine/editProfile' });
  }
});
