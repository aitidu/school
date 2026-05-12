const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { repairId, worker } = event;

  if (!repairId) {
    return { code: -1, msg: '工单ID不能为空' };
  }
  if (!worker || !worker.trim()) {
    return { code: -1, msg: '请填写维修人员' };
  }

  try {
    const { data: users } = await db.collection('users').where({ _openid: OPENID }).get();
    if (users.length === 0 || users[0].role !== 'manager') {
      return { code: -1, msg: '无权限操作' };
    }

    const { data: repair } = await db.collection('repairs').doc(repairId).get();
    if (!repair) {
      return { code: -1, msg: '工单不存在' };
    }
    if (repair.status !== 'pending') {
      return { code: -1, msg: '仅可派单待处理的工单' };
    }

    await db.collection('repairs').doc(repairId).update({
      data: {
        status: 'assigned',
        worker: worker.trim()
      }
    });

    return { code: 0, data: { _id: repairId } };
  } catch (err) {
    return { code: -1, msg: err.message || '派单失败' };
  }
};
