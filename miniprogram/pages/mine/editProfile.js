const { callFunction } = require('../../utils/cloud');
const app = getApp();

Page({
  data: {
    realName: '',
    studentId: '',
    phone: '',
    dormitory: ''
  },

  onLoad() {
    const user = app.globalData.userInfo;
    if (user) {
      this.setData({
        realName: user.realName || '',
        studentId: user.studentId || '',
        phone: user.phone || '',
        dormitory: user.dormitory || ''
      });
    }
  },

  onInput(e) {
    const { field } = e.currentTarget.dataset;
    this.setData({ [field]: e.detail.value });
  },

  submit() {
    const { realName, studentId, phone, dormitory } = this.data;

    if (!realName.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!studentId.trim()) {
      wx.showToast({ title: '请输入学号', icon: 'none' });
      return;
    }

    callFunction('updateUser', { realName, studentId, phone, dormitory })
      .then(() => {
        const user = app.globalData.userInfo;
        Object.assign(user, { realName, studentId, phone, dormitory });
        wx.showToast({ title: '保存成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 1500);
      })
      .catch(() => {});
  }
});
