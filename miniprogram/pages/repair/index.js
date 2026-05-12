const { callFunction } = require('../../utils/cloud');
const { uploadImages } = require('../../utils/upload');

Page({
  data: {
    types: ['水电', '门窗', '网络', '其他'],
    typeIndex: -1,
    description: '',
    images: [],
    submitting: false
  },

  onSelectType(e) {
    this.setData({ typeIndex: e.currentTarget.dataset.index });
  },

  onInput(e) {
    this.setData({ description: e.detail.value });
  },

  onChooseImage() {
    const { images } = this.data;
    const remain = 9 - images.length;
    if (remain <= 0) {
      wx.showToast({ title: '最多上传9张', icon: 'none' });
      return;
    }
    wx.chooseImage({
      count: remain,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        this.setData({ images: [...images, ...res.tempFilePaths] });
      }
    });
  },

  onRemoveImage(e) {
    const idx = e.currentTarget.dataset.index;
    const images = this.data.images.filter((_, i) => i !== idx);
    this.setData({ images });
  },

  async onSubmit() {
    const { typeIndex, description, images, submitting } = this.data;
    if (submitting) return;

    if (typeIndex === -1) {
      wx.showToast({ title: '请选择报修类型', icon: 'none' });
      return;
    }
    if (!description.trim()) {
      wx.showToast({ title: '请填写问题描述', icon: 'none' });
      return;
    }

    this.setData({ submitting: true });

    try {
      let fileIDs = [];
      if (images.length > 0) {
        fileIDs = await uploadImages(images);
      }

      await callFunction('createRepair', {
        type: this.data.types[typeIndex],
        description: description.trim(),
        images: fileIDs
      });

      wx.showToast({ title: '提交成功', icon: 'success' });
      this.setData({
        typeIndex: -1,
        description: '',
        images: []
      });
    } catch (err) {
      // errors handled by callFunction
    } finally {
      this.setData({ submitting: false });
    }
  }
});
