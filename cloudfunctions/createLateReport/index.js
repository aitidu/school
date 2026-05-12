const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { expectedTime, reason } = event;

  if (!expectedTime) {
    return { code: -1, msg: '请选择预计归寝时间' };
  }
  if (!reason || !reason.trim()) {
    return { code: -1, msg: '请填写晚归原因' };
  }

  try {
    const data = {
      _openid: OPENID,
      expectedTime,
      reason: reason.trim(),
      status: 'pending',
      createTime: db.serverDate()
    };
    const { _id } = await db.collection('late_reports').add({ data });
    return { code: 0, data: { _id, ...data } };
  } catch (err) {
    return { code: -1, msg: err.message || '提交失败' };
  }
};
