const { callFunction } = require('../../utils/cloud');

Page({
  data: {
    startDate: '',
    startTime: '',
    endDate: '',
    endTime: '',
    reason: '',
    submitting: false
  },

  onStartDateChange(e) {
    this.setData({ startDate: e.detail.value });
  },

  onStartTimeChange(e) {
    this.setData({ startTime: e.detail.value });
  },

  onEndDateChange(e) {
    this.setData({ endDate: e.detail.value });
  },

  onEndTimeChange(e) {
    this.setData({ endTime: e.detail.value });
  },

  onReasonInput(e) {
    this.setData({ reason: e.detail.value });
  },

  submit() {
    const { startDate, startTime, endDate, endTime, reason } = this.data;
    if (!startDate || !startTime) {
      wx.showToast({ title: '请选择开始时间', icon: 'none' });
      return;
    }
    if (!endDate || !endTime) {
      wx.showToast({ title: '请选择结束时间', icon: 'none' });
      return;
    }
    if (!reason.trim()) {
      wx.showToast({ title: '请填写请假原因', icon: 'none' });
      return;
    }

    const start = `${startDate} ${startTime}:00`;
    const end = `${endDate} ${endTime}:00`;
    if (new Date(start) >= new Date(end)) {
      wx.showToast({ title: '开始时间必须早于结束时间', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });
    callFunction('createLeaveRequest', { reason: reason.trim(), startTime: start, endTime: end })
      .then(() => {
        wx.showToast({ title: '提交成功', icon: 'success' });
        setTimeout(() => wx.navigateBack(), 1500);
      })
      .catch(() => {
        this.setData({ submitting: false });
      });
  }
});
