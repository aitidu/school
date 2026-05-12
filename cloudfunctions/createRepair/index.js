const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { type, description, images } = event;

  const validTypes = ['水电', '门窗', '网络', '其他'];
  if (!type || !validTypes.includes(type)) {
    return { code: -1, msg: '无效的报修类型' };
  }
  if (!description || !description.trim()) {
    return { code: -1, msg: '请填写问题描述' };
  }

  try {
    const repair = {
      _openid: OPENID,
      type,
      description: description.trim(),
      images: images || [],
      status: 'pending',
      worker: '',
      evaluation: { rating: 0, comment: '' },
      createTime: db.serverDate()
    };

    const { _id } = await db.collection('repairs').add({ data: repair });

    return { code: 0, data: { _id, ...repair } };
  } catch (err) {
    return { code: -1, msg: err.message || '提交失败' };
  }
};
