const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();

  try {
    const { data: users } = await db.collection('users').where({ _openid: OPENID }).get();

    if (users.length > 0) {
      return { code: 0, data: users[0] };
    }

    const newUser = {
      _openid: OPENID,
      role: 'student',
      realName: '',
      studentId: '',
      phone: '',
      dormitory: '',
      isAuth: false,
      createTime: db.serverDate()
    };

    await db.collection('users').add({ data: newUser });

    return { code: 0, data: newUser };
  } catch (err) {
    return { code: -1, msg: err.message || '登录失败' };
  }
};
