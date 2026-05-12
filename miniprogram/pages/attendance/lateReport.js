const { callFunction } = require('../../utils/cloud');

Page({
  data: {
    expectedTime: '',
    reason: '',
    submitting: false
  },

  onTimeChange(e) {
    this.setData({ expectedTime: e.detail.value });
  },

  onReasonInput(e) {
    this.setData({ reason: e.detail.value });
  },

  submit() {
    const { expectedTime, reason } = this.data;
    if (!expectedTime) {
      wx.showToast({ title: '请选择预计归寝时间', icon: 'none' });
      return;
    }
    if (!reason.trim()) {
      wx.showToast({ title: '请填写晚归原因', icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    callFunction('createLateReport', { expectedTime, reason: reason.trim() })
      .then(() => {
        wx.showToast({ title: '提交成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 1500);
      })
      .catch(() => {
        this.setData({ submitting: false });
      });
  }
});
