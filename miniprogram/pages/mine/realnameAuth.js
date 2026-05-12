const { callFunction } = require('../../utils/cloud');
const app = getApp();

Page({
  data: {
    realName: '',
    studentId: ''
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [field]: e.detail.value });
  },

  submit() {
    const { realName, studentId } = this.data;

    if (!realName.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!studentId.trim()) {
      wx.showToast({ title: '请输入学号', icon: 'none' });
      return;
    }

    callFunction('authUser', { realName, studentId })
      .then(() => {
        const user = app.globalData.userInfo;
        if (user) {
          user.isAuth = true;
          user.realName = realName;
          user.studentId = studentId;
        }
        wx.showToast({ title: '认证成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 1500);
      })
      .catch(() => {});
  }
});
