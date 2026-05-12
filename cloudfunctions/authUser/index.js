const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { realName, studentId } = event;

  try {
    const { data: users } = await db.collection('users').where({ _openid: OPENID }).get();

    if (users.length === 0) {
      return { code: -1, msg: '用户不存在' };
    }

    await db.collection('users').doc(users[0]._id).update({
      data: { realName, studentId, isAuth: true }
    });

    return { code: 0, data: { _id: users[0]._id, realName, studentId, isAuth: true } };
  } catch (err) {
    return { code: -1, msg: err.message || '认证失败' };
  }
};
