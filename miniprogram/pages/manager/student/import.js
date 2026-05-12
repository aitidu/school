const { callFunction } = require('../../../utils/cloud');
const app = getApp();

Page({
  data: {
    file: null,
    uploading: false,
    importing: false,
    result: null
  },

  onLoad() {
    const user = app.globalData.userInfo;
    if (!user || user.role !== 'manager') {
      wx.redirectTo({ url: '/pages/index/index' });
      return;
    }
  },

  chooseFile() {
    wx.chooseMessageFile({
      count: 1,
      type: 'file',
      extension: ['csv'],
      success: (res) => {
        const file = res.tempFiles[0];
        if (!file.name.endsWith('.csv')) {
          wx.showToast({ title: '请选择CSV文件', icon: 'none' });
          return;
        }
        this.setData({ file, result: null });
      }
    });
  },

  async uploadAndImport() {
    const { file } = this.data;
    if (!file) {
      wx.showToast({ title: '请先选择CSV文件', icon: 'none' });
      return;
    }

    this.setData({ uploading: true });
    try {
      const uploadRes = await wx.cloud.uploadFile({
        cloudPath: `csv_import/${Date.now()}_${file.name}`,
        filePath: file.path
      });

      this.setData({ uploading: false, importing: true });

      const result = await callFunction('batchImportStudents', {
        fileID: uploadRes.fileID
      });

      this.setData({
        importing: false,
        result: {
          total: result.total,
          success: result.success,
          fail: result.fail,
          errors: result.errors || []
        },
        file: null
      });
    } catch (err) {
      this.setData({ uploading: false, importing: false });
    }
  }
});
