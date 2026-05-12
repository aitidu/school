const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { _id, realName, studentId, phone, dormitory } = event;

  try {
    const { data: users } = await db.collection('users').where({ _openid: OPENID }).get();
    if (users.length === 0 || users[0].role !== 'manager') {
      return { code: -1, msg: '无权限操作' };
    }

    const data = { realName, studentId, phone, dormitory };

    if (_id) {
      await db.collection('users').doc(_id).update({ data });
      return { code: 0, data: { _id, ...data } };
    }

    const { data: exist } = await db.collection('users').where({ studentId, role: 'student' }).get();
    if (exist.length > 0) {
      await db.collection('users').doc(exist[0]._id).update({ data });
      return { code: 0, data: { _id: exist[0]._id, ...data } };
    }

    const newUser = {
      _openid: '',
      role: 'student',
      realName,
      studentId,
      phone,
      dormitory,
      isAuth: true,
      createTime: db.serverDate()
    };

    const res = await db.collection('users').add({ data: newUser });
    return { code: 0, data: { _id: res._id, ...newUser } };
  } catch (err) {
    return { code: -1, msg: err.message || '操作失败' };
  }
};
