const { callFunction } = require('../../../utils/cloud');
const app = getApp();

Page({
  data: {
    id: '',
    realName: '',
    studentId: '',
    phone: '',
    dormitory: '',
    loading: false,
    isEdit: false
  },

  onLoad(options) {
    const user = app.globalData.userInfo;
    if (!user || user.role !== 'manager') {
      wx.redirectTo({ url: '/pages/index/index' });
      return;
    }

    if (options.id) {
      this.setData({ id: options.id, isEdit: true });
      wx.setNavigationBarTitle({ title: '编辑学生' });
      this.loadStudent(options.id);
    } else {
      wx.setNavigationBarTitle({ title: '新增学生' });
    }
  },

  async loadStudent(id) {
    this.setData({ loading: true });
    try {
      const result = await callFunction('getStudentList', {
        keyword: '',
        page: 1,
        pageSize: 200
      });
      const student = (result.list || []).find(s => s._id === id);
      if (student) {
        this.setData({
          realName: student.realName || '',
          studentId: student.studentId || '',
          phone: student.phone || '',
          dormitory: student.dormitory || ''
        });
      }
    } catch (err) {
      // handled by callFunction
    }
    this.setData({ loading: false });
  },

  onNameInput(e) {
    this.setData({ realName: e.detail.value });
  },

  onIdInput(e) {
    this.setData({ studentId: e.detail.value });
  },

  onPhoneInput(e) {
    this.setData({ phone: e.detail.value });
  },

  onDormInput(e) {
    this.setData({ dormitory: e.detail.value });
  },

  async save() {
    const { id, realName, studentId, phone, dormitory } = this.data;

    if (!realName.trim()) {
      wx.showToast({ title: '请输入姓名', icon: 'none' });
      return;
    }
    if (!studentId.trim()) {
      wx.showToast({ title: '请输入学号', icon: 'none' });
      return;
    }

    this.setData({ loading: true });
    try {
      await callFunction('addOrUpdateStudent', {
        _id: id || undefined,
        realName: realName.trim(),
        studentId: studentId.trim(),
        phone: phone.trim(),
        dormitory: dormitory.trim()
      });
      wx.showToast({ title: id ? '修改成功' : '新增成功', icon: 'success' });
      setTimeout(() => {
        wx.navigateBack();
      }, 1200);
    } catch (err) {
      // handled by callFunction
    }
    this.setData({ loading: false });
  }
});
