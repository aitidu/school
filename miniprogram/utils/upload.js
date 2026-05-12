function uploadImages(paths) {
  return Promise.all(
    paths.map((path, index) => {
      const suffix = Math.random().toString(36).slice(2, 10);
      const cloudPath = `repairs/${Date.now()}_${index}_${suffix}.jpg`;
      return wx.cloud.uploadFile({
        cloudPath,
        filePath: path
      }).then(res => res.fileID);
    })
  );
}

module.exports = { uploadImages };
