const { callFunction } = require('../../utils/cloud');

const typeMap = {
  normal: '正常',
  late: '晚归',
  unreturned: '未归'
};

function formatTime(str) {
  if (!str) return '';
  const d = new Date(str);
  const pad = n => n < 10 ? '0' + n : n;
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

Page({
  data: {
    records: [],
    loading: true
  },

  onShow() {
    this.loadRecords();
  },

  loadRecords() {
    this.setData({ loading: true });
    callFunction('getMyAttendance')
      .then((data) => {
        const records = (data || []).map(item => ({
          ...item,
          typeText: typeMap[item.type] || item.type,
          checkTimeStr: formatTime(item.checkTime)
        }));
        this.setData({ records, loading: false });
      })
      .catch(() => {
        this.setData({ loading: false });
      });
  }
});
