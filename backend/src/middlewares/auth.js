const { verifyToken, getTokenFromHeader } = require('../utils/jwt');
const { unauthorized, error } = require('../utils/response');

/**
 * 认证中间件
 */
exports.auth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    
    if (!token) {
      return res.status(401).json(unauthorized('未提供认证令牌'));
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json(unauthorized('认证令牌无效或已过期'));
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(500).json(error('认证失败'));
  }
};

/**
 * 管理员权限中间件
 */
exports.adminAuth = async (req, res, next) => {
  try {
    const token = getTokenFromHeader(req);
    
    if (!token) {
      return res.status(401).json(unauthorized('未提供认证令牌'));
    }
    
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return res.status(401).json(unauthorized('认证令牌无效或已过期'));
    }
    
    if (decoded.role !== 1) {
      return res.status(403).json({
        code: 403,
        message: '权限不足，需要管理员权限',
        data: null
      });
    }
    
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(500).json(error('认证失败'));
  }
};
