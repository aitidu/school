const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { fileID } = event;

  try {
    const { data: users } = await db.collection('users').where({ _openid: OPENID }).get();
    if (users.length === 0 || users[0].role !== 'manager') {
      return { code: -1, msg: '无权限操作' };
    }

    if (!fileID) {
      return { code: -1, msg: '文件ID不能为空' };
    }

    const res = await cloud.downloadFile({ fileID });
    const csv = res.fileContent.toString('utf-8').trim();

    if (!csv) {
      return { code: -1, msg: '文件内容为空' };
    }

    const lines = csv.split(/\r?\n/);
    if (lines.length < 2) {
      return { code: -1, msg: 'CSV文件至少需要包含表头和数据行' };
    }

    const header = lines[0].split(',').map(h => h.trim());
    const nameIdx = header.indexOf('姓名');
    const idIdx = header.indexOf('学号');
    const phoneIdx = header.indexOf('手机');
    const dormIdx = header.indexOf('宿舍楼栋');

    if (nameIdx === -1 || idIdx === -1 || phoneIdx === -1 || dormIdx === -1) {
      return { code: -1, msg: 'CSV表头必须包含：姓名,学号,手机,宿舍楼栋' };
    }

    let success = 0;
    let fail = 0;
    const errors = [];

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      const cols = line.split(',').map(c => c.trim());
      const realName = cols[nameIdx];
      const studentId = cols[idIdx];
      const phone = cols[phoneIdx];
      const dormitory = cols[dormIdx];

      if (!realName || !studentId) {
        fail++;
        errors.push(`第${i + 1}行：姓名或学号不能为空`);
        continue;
      }

      try {
        const { data: exist } = await db.collection('users')
          .where({ studentId, role: 'student' })
          .get();

        if (exist.length > 0) {
          await db.collection('users').doc(exist[0]._id).update({
            data: { realName, phone, dormitory, isAuth: true }
          });
        } else {
          await db.collection('users').add({
            data: {
              _openid: '',
              role: 'student',
              realName,
              studentId,
              phone,
              dormitory,
              isAuth: true,
              createTime: db.serverDate()
            }
          });
        }
        success++;
      } catch (err) {
        fail++;
        errors.push(`第${i + 1}行：${err.message}`);
      }
    }

    return {
      code: 0,
      data: {
        total: lines.length - 1,
        success,
        fail,
        errors: errors.slice(0, 50)
      }
    };
  } catch (err) {
    return { code: -1, msg: err.message || '导入失败' };
  }
};
