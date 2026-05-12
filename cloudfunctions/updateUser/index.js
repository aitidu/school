const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { realName, studentId, phone, dormitory } = event;

  try {
    const { data: users } = await db.collection('users').where({ _openid: OPENID }).get();

    if (users.length === 0) {
      return { code: -1, msg: '用户不存在' };
    }

    await db.collection('users').doc(users[0]._id).update({
      data: { realName, studentId, phone, dormitory }
    });

    return { code: 0, data: { _id: users[0]._id, realName, studentId, phone, dormitory } };
  } catch (err) {
    return { code: -1, msg: err.message || '更新失败' };
  }
};
