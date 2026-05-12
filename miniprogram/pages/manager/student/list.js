const { callFunction } = require('../../../utils/cloud');
const app = getApp();

Page({
  data: {
    keyword: '',
    students: [],
    page: 1,
    pageSize: 20,
    total: 0,
    loading: false,
    hasMore: true
  },

  onLoad() {
    const user = app.globalData.userInfo;
    if (!user || user.role !== 'manager') {
      wx.redirectTo({ url: '/pages/index/index' });
      return;
    }
    this.loadList();
  },

  onShow() {
    if (this.data.students.length > 0) {
      this.loadList(true);
    }
  },

  onReachBottom() {
    if (this.data.hasMore && !this.data.loading) {
      this.loadMore();
    }
  },

  async loadList(reset) {
    if (reset) {
      this.setData({ page: 1, hasMore: true });
    }
    this.setData({ loading: true });
    try {
      const { keyword, page, pageSize } = this.data;
      const result = await callFunction('getStudentList', {
        keyword: keyword.trim(),
        page,
        pageSize
      });
      const list = result.list || [];
      this.setData({
        students: list,
        total: result.total || 0,
        hasMore: list.length >= pageSize,
        loading: false
      });
    } catch (err) {
      this.setData({ loading: false });
    }
  },

  async loadMore() {
    const { page, students } = this.data;
    const nextPage = page + 1;
    this.setData({ page: nextPage, loading: true });
    try {
      const { keyword, pageSize } = this.data;
      const result = await callFunction('getStudentList', {
        keyword: keyword.trim(),
        page: nextPage,
        pageSize
      });
      const list = result.list || [];
      const newStudents = students.concat(list);
      this.setData({
        students: newStudents,
        hasMore: list.length >= pageSize,
        loading: false
      });
    } catch (err) {
      this.setData({ loading: false });
    }
  },

  onSearchInput(e) {
    this.setData({ keyword: e.detail.value });
  },

  onSearch() {
    this.loadList(true);
  },

  goToEdit(e) {
    const { id } = e.currentTarget.dataset;
    if (id) {
      wx.navigateTo({ url: `/pages/manager/student/edit?id=${id}` });
    } else {
      wx.navigateTo({ url: '/pages/manager/student/edit' });
    }
  },

  goToImport() {
    wx.navigateTo({ url: '/pages/manager/student/import' });
  }
});
