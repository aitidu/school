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
    repairs: [],
    loading: true
  },

  onShow() {
    this.loadRepairs();
  },

  async loadRepairs() {
    this.setData({ loading: true });
    try {
      const repairs = await callFunction('getMyRepairs');
      const list = repairs.map(r => ({
        ...r,
        statusText: statusMap[r.status] || r.status,
        createTimeStr: formatTime(r.createTime)
      }));
      this.setData({ repairs: list, loading: false });
    } catch (err) {
      this.setData({ loading: false });
    }
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/repair/detail?id=${id}` });
  }
});
