const { callFunction } = require('../../utils/cloud');

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
    showEvaluation: false,
    rating: 0,
    comment: '',
    submitting: false
  },

  onLoad(options) {
    this.repairId = options.id;
    this.loadDetail();
  },

  async loadDetail() {
    this.setData({ loading: true });
    try {
      const repairs = await callFunction('getMyRepairs');
      const repair = repairs.find(r => r._id === this.repairId);
      if (repair) {
        repair.statusText = statusMap[repair.status] || repair.status;
        repair.createTimeStr = formatTime(repair.createTime);
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

  onRate(e) {
    this.setData({ rating: e.currentTarget.dataset.index + 1 });
  },

  onCommentInput(e) {
    this.setData({ comment: e.detail.value });
  },

  showEval() {
    this.setData({ showEvaluation: true });
  },

  cancelEval() {
    this.setData({ showEvaluation: false, rating: 0, comment: '' });
  },

  async submitEvaluation() {
    const { rating, comment, submitting } = this.data;
    if (submitting) return;
    if (!rating) {
      wx.showToast({ title: '请选择评分', icon: 'none' });
      return;
    }
    this.setData({ submitting: true });
    try {
      await callFunction('evaluateRepair', {
        repairId: this.repairId,
        rating,
        comment: comment.trim()
      });
      wx.showToast({ title: '评价成功', icon: 'success' });
      this.setData({ showEvaluation: false, rating: 0, comment: '' });
      this.loadDetail();
    } catch (err) {
      // handled by callFunction
    } finally {
      this.setData({ submitting: false });
    }
  },

  onUrge() {
    wx.showToast({ title: '已催单，请耐心等待', icon: 'success' });
  }
});
