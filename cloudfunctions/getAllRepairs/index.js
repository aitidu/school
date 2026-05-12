const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { status } = event;

  try {
    const { data: users } = await db.collection('users').where({ _openid: OPENID }).get();
    if (users.length === 0 || users[0].role !== 'manager') {
      return { code: -1, msg: '无权限操作' };
    }

    let query = db.collection('repairs');
    if (status) {
      query = query.where({ status });
    }
    const { data: repairs } = await query.orderBy('createTime', 'desc').get();

    return { code: 0, data: repairs };
  } catch (err) {
    return { code: -1, msg: err.message || '查询失败' };
  }
};
