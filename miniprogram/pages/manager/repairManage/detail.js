const { callFunction } = require('../../../utils/cloud');

const app = getApp();

const statusMap = {
  pending: '待处理',
  assigned: '已指派',
  in_progress: '处理中',
  completed: '已完成',
  archived: '已归档'
};

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

Page({
  data: {
    repair: null,
    loading: true,
    showAssign: false,
    workerName: '',
    submitting: false
  },

  onLoad(options) {
    const user = app.globalData.userInfo;
    if (!user || user.role !== 'manager') {
      wx.redirectTo({ url: '/pages/index/index' });
      return;
    }
    this.managerName = user.realName || '';
    this.repairId = options.id;
    this.loadDetail();
  },

  async loadDetail() {
    this.setData({ loading: true });
    try {
      const repairs = await callFunction('getAllRepairs');
      const repair = repairs.find(r => r._id === this.repairId);
      if (repair) {
        repair.statusText = statusMap[repair.status] || repair.status;
        repair.createTimeStr = formatTime(repair.createTime);
        if (repair.completedTime) {
          repair.completedTimeStr = formatTime(repair.completedTime);
        }
        this.setData({ repair, loading: false });
      } else {
        wx.showToast({ title: '工单不存在', icon: 'none' });
        this.setData({ loading: false });
      }
    } catch (err) {
      this.setData({ loading: false });
    }
  },

  onPreviewImage(e) {
    const { url } = e.currentTarget.dataset;
    const urls = this.data.repair.images;
    wx.previewImage({ current: url, urls });
  },

  // 接单：将工单指派给自己
  async onAccept() {
    if (!this.managerName) {
      wx.showToast({ title: '请先完善姓名信息', icon: 'none' });
      return;
    }
    wx.showModal({
      title: '确认接单',
      content: `将本工单指派给 ${this.managerName}？`,
      success: async (res) => {
        if (!res.confirm) return;
        this.setData({ submitting: true });
        try {
          await callFunction('assignRepair', {
            repairId: this.repairId,
            worker: this.managerName
          });
          wx.showToast({ title: '接单成功', icon: 'success' });
          this.loadDetail();
        } catch (err) {
          // handled by callFunction
        } finally {
          this.setData({ submitting: false });
        }
      }
    });
  },

  // 派单：弹出输入框填写维修人员
  showAssignDialog() {
    this.setData({ showAssign: true, workerName: '' });
  },

  cancelAssign() {
    this.setData({ showAssign: false, workerName: '' });
  },

  onWorkerNameInput(e) {
    this.setData({ workerName: e.detail.value });
  },

  async onAssign() {
    const { workerName, submitting } = this.data;
    if (submitting) return;
    if (!workerName.trim()) {
      wx.showToast({ title: '请填写维修人员', icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    try {
      await callFunction('assignRepair', {
        repairId: this.repairId,
        worker: workerName.trim()
      });
      wx.showToast({ title: '派单成功', icon: 'success' });
      this.setData({ showAssign: false, workerName: '' });
      this.loadDetail();
    } catch (err) {
      // handled by callFunction
    } finally {
      this.setData({ submitting: false });
    }
  },

  async onStartRepair() {
    wx.showModal({
      title: '确认开始',
      content: '确认开始处理此工单？',
      success: async (res) => {
        if (!res.confirm) return;
        this.setData({ submitting: true });
        try {
          await callFunction('startRepair', { repairId: this.repairId });
          wx.showToast({ title: '已开始处理', icon: 'success' });
          this.loadDetail();
        } catch (err) {
          // handled by callFunction
        } finally {
          this.setData({ submitting: false });
        }
      }
    });
  },

  async onComplete() {
    wx.showModal({
      title: '确认完成',
      content: '确认将此工单标记为已完成？',
      success: async (res) => {
        if (!res.confirm) return;
        this.setData({ submitting: true });
        try {
          await callFunction('completeRepair', { repairId: this.repairId });
          wx.showToast({ title: '已完成', icon: 'success' });
          this.loadDetail();
        } catch (err) {
          // handled by callFunction
        } finally {
          this.setData({ submitting: false });
        }
      }
    });
  },

  async onArchive() {
    wx.showModal({
      title: '确认归档',
      content: '确认将此工单归档？归档后不可恢复。',
      success: async (res) => {
        if (!res.confirm) return;
        this.setData({ submitting: true });
        try {
          await callFunction('archiveRepair', { repairId: this.repairId });
          wx.showToast({ title: '已归档', icon: 'success' });
          this.loadDetail();
        } catch (err) {
          // handled by callFunction
        } finally {
          this.setData({ submitting: false });
        }
      }
    });
  }
});
