const { callFunction } = require('../../../utils/cloud');

const app = getApp();

const statusMap = {
  pending: '待处理',
  assigned: '已指派',
  in_progress: '处理中',
  completed: '已完成',
  archived: '已归档'
};

const tabs = [
  { key: 'pending', label: '待处理' },
  { key: 'processing', label: '处理中' },
  { key: 'completed', label: '已完成' },
  { key: 'archived', label: '已归档' }
];

function formatTime(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  const pad = n => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

Page({
  data: {
    tabs,
    activeTab: 'pending',
    repairs: [],
    allRepairs: [],
    loading: true
  },

  onLoad() {
    const user = app.globalData.userInfo;
    if (!user || user.role !== 'manager') {
      wx.redirectTo({ url: '/pages/index/index' });
      return;
    }
    this.loadRepairs();
  },

  async loadRepairs() {
    this.setData({ loading: true });
    try {
      const repairs = await callFunction('getAllRepairs');
      const list = repairs.map(r => ({
        ...r,
        statusText: statusMap[r.status] || r.status,
        createTimeStr: formatTime(r.createTime)
      }));
      this.setData({ allRepairs: list, loading: false }, () => {
        this.filterByTab();
      });
    } catch (err) {
      this.setData({ loading: false });
    }
  },

  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab }, () => {
      this.filterByTab();
    });
  },

  filterByTab() {
    const { allRepairs, activeTab } = this.data;
    let filtered;
    switch (activeTab) {
      case 'pending':
        filtered = allRepairs.filter(r => r.status === 'pending');
        break;
      case 'processing':
        filtered = allRepairs.filter(r => r.status === 'assigned' || r.status === 'in_progress');
        break;
      case 'completed':
        filtered = allRepairs.filter(r => r.status === 'completed');
        break;
      case 'archived':
        filtered = allRepairs.filter(r => r.status === 'archived');
        break;
      default:
        filtered = allRepairs;
    }
    this.setData({ repairs: filtered });
  },

  goToDetail(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({ url: `/pages/manager/repairManage/detail?id=${id}` });
  }
});
