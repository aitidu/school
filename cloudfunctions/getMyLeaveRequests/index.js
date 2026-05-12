const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async () => {
  const { OPENID } = cloud.getWXContext();

  try {
    const { data } = await db.collection('leave_requests')
      .where({ _openid: OPENID })
      .orderBy('createTime', 'desc')
      .get();
    return { code: 0, data };
  } catch (err) {
    return { code: -1, msg: err.message || '查询失败' };
  }
};
