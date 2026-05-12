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

  goToCheckIn() {
    wx.navigateTo({ url: '/pages/manager/attendance/checkIn' });
  },

  goToAttendanceRecords() {
    wx.navigateTo({ url: '/pages/manager/attendance/records' });
  },

  goToLeaveReview() {
    wx.navigateTo({ url: '/pages/manager/attendance/leaveReview' });
  },

  goToLateReportReview() {
    wx.navigateTo({ url: '/pages/manager/attendance/lateReportReview' });
  },

  goToAbnormal() {
    wx.navigateTo({ url: '/pages/manager/attendance/abnormal' });
  },

  goToStudentManage() {
    wx.navigateTo({ url: '/pages/manager/student/list' });
  },

  goToEditProfile() {
    wx.navigateTo({ url: '/pages/mine/editProfile' });
  }
});
