const bcrypt = require('bcrypt');
const { User } = require('../models');
const { generateToken } = require('../utils/jwt');

const SALT_ROUNDS = 10;

/**
 * 用户注册
 */
exports.register = async (username, email, password) => {
  // 检查用户名是否已存在
  const existUser = await User.findOne({
    where: {
      [User.sequelize.Op.or]: [{ username }, { email }]
    }
  });
  
  if (existUser) {
    throw new Error('用户名或邮箱已被使用');
  }
  
  // 加密密码
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
  // 创建用户
  const user = await User.create({
    username,
    email,
    password: hashedPassword
  });
  
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    role: user.role
  };
};

/**
 * 用户登录
 */
exports.login = async (username, password) => {
  // 查找用户
  const user = await User.findOne({
    where: {
      [User.sequelize.Op.or]: [
        { username },
        { email: username }
      ]
    }
  });
  
  if (!user) {
    throw new Error('用户名或密码错误');
  }
  
  if (user.status === 0) {
    throw new Error('账号已被禁用');
  }
  
  // 验证密码
  const isMatch = await bcrypt.compare(password, user.password);
  
  if (!isMatch) {
    throw new Error('用户名或密码错误');
  }
  
  // 更新最后登录时间
  await user.update({ lastLoginAt: new Date() });
  
  // 生成token
  const token = generateToken({
    id: user.id,
    username: user.username,
    role: user.role
  });
  
  return {
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      nickname: user.nickname,
      avatar: user.avatar,
      role: user.role
    }
  };
};

/**
 * 获取用户信息
 */
exports.getUserById = async (id) => {
  const user = await User.findByPk(id, {
    attributes: ['id', 'username', 'email', 'nickname', 'avatar', 'role', 'createdAt']
  });
  
  return user;
};

/**
 * 更新用户信息
 */
exports.updateUser = async (id, data) => {
  const user = await User.findByPk(id);
  
  if (!user) {
    throw new Error('用户不存在');
  }
  
  await user.update(data);
  
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    nickname: user.nickname,
    avatar: user.avatar,
    role: user.role
  };
};
