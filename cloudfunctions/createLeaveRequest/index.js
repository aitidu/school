const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { reason, startTime, endTime } = event;

  if (!startTime) {
    return { code: -1, msg: '请选择开始时间' };
  }
  if (!endTime) {
    return { code: -1, msg: '请选择结束时间' };
  }
  if (new Date(startTime) >= new Date(endTime)) {
    return { code: -1, msg: '开始时间必须早于结束时间' };
  }
  if (!reason || !reason.trim()) {
    return { code: -1, msg: '请填写请假原因' };
  }

  try {
    const data = {
      _openid: OPENID,
      reason: reason.trim(),
      startTime,
      endTime,
      status: 'pending',
      reviewer: '',
      createTime: db.serverDate()
    };
    const { _id } = await db.collection('leave_requests').add({ data });
    return { code: 0, data: { _id, ...data } };
  } catch (err) {
    return { code: -1, msg: err.message || '提交失败' };
  }
};
