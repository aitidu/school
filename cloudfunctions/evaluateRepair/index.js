const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });

const db = cloud.database();

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { repairId, rating, comment } = event;

  if (!repairId) {
    return { code: -1, msg: '工单ID不能为空' };
  }
  if (!rating || rating < 1 || rating > 5) {
    return { code: -1, msg: '请选择1-5星评分' };
  }

  try {
    const { data: repair } = await db.collection('repairs').doc(repairId).get();

    if (!repair) {
      return { code: -1, msg: '工单不存在' };
    }

    if (repair._openid !== OPENID) {
      return { code: -1, msg: '无权操作此工单' };
    }

    if (repair.status !== 'completed') {
      return { code: -1, msg: '仅可评价已完成的工单' };
    }

    await db.collection('repairs').doc(repairId).update({
      data: {
        evaluation: { rating, comment: comment || '' },
        status: 'archived'
      }
    });

    return { code: 0, data: { _id: repairId } };
  } catch (err) {
    return { code: -1, msg: err.message || '评价失败' };
  }
};
