/**
 * 统一响应格式化工具
 */

/**
 * 成功响应
 */
exports.success = (data = null, message = '操作成功') => {
  return {
    code: 200,
    message,
    data
  };
};

/**
 * 失败响应
 */
exports.error = (message = '操作失败', code = 500, data = null) => {
  return {
    code,
    message,
    data
  };
};

/**
 * 参数错误响应
 */
exports.paramError = (message = '参数错误') => {
  return {
    code: 400,
    message,
    data: null
  };
};

/**
 * 未授权响应
 */
exports.unauthorized = (message = '未授权，请先登录') => {
  return {
    code: 401,
    message,
    data: null
  };
};

/**
 * 禁止访问响应
 */
exports.forbidden = (message = '权限不足') => {
  return {
    code: 403,
    message,
    data: null
  };
};

/**
 * 资源不存在响应
 */
exports.notFound = (message = '资源不存在') => {
  return {
    code: 404,
    message,
    data: null
  };
};
