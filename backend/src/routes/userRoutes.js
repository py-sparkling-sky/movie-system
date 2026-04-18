const express = require('express');
const router = express.Router();
const userService = require('../services/userService');
const { auth } = require('../middlewares/auth');
const { success, error, paramError } = require('../utils/response');

/**
 * 用户注册
 * POST /api/users/register
 */
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json(paramError('请填写完整的注册信息'));
    }
    
    const user = await userService.register(username, email, password);
    res.json(success(user, '注册成功'));
  } catch (err) {
    res.status(400).json(error(err.message, 400));
  }
});

/**
 * 用户登录
 * POST /api/users/login
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    if (!username || !password) {
      return res.status(400).json(paramError('请填写用户名和密码'));
    }
    
    const result = await userService.login(username, password);
    res.json(success(result, '登录成功'));
  } catch (err) {
    res.status(400).json(error(err.message, 400));
  }
});

/**
 * 获取用户信息
 * GET /api/users/profile
 */
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await userService.getUserById(req.user.id);
    res.json(success(user));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
});

/**
 * 更新用户信息
 * PUT /api/users/profile
 */
router.put('/profile', auth, async (req, res) => {
  try {
    const { nickname, avatar } = req.body;
    const user = await userService.updateUser(req.user.id, { nickname, avatar });
    res.json(success(user, '更新成功'));
  } catch (err) {
    res.status(400).json(error(err.message, 400));
  }
});

module.exports = router;
