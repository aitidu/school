const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { keyword, page = 1, pageSize = 20 } = event;

  try {
    const { data: users } = await db.collection('users').where({ _openid: OPENID }).get();
    if (users.length === 0 || users[0].role !== 'manager') {
      return { code: -1, msg: '无权限操作' };
    }

    let where = { role: 'student' };

    if (keyword && keyword.trim()) {
      const kw = keyword.trim();
      where = _.and([
        { role: 'student' },
        _.or([
          { realName: db.RegExp({ regexp: kw, options: 'i' }) },
          { studentId: db.RegExp({ regexp: kw, options: 'i' }) },
          { dormitory: db.RegExp({ regexp: kw, options: 'i' }) }
        ])
      ]);
    }

    const countRes = await db.collection('users').where(where).count();
    const total = countRes.total;

    const { data: list } = await db.collection('users')
      .where(where)
      .orderBy('createTime', 'desc')
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .get();

    return { code: 0, data: { list, total, page, pageSize } };
  } catch (err) {
    return { code: -1, msg: err.message || '查询失败' };
  }
};
