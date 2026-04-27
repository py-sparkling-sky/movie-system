const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middlewares/auth');
const adminService = require('../services/adminService');
const { success, error } = require('../utils/response');

// 所有路由都需要管理员权限
router.use(adminAuth);

/**
 * 获取统计数据
 * GET /api/admin/statistics
 */
router.get('/statistics', async (req, res) => {
  try {
    const stats = await adminService.getStatistics();
    res.json(success(stats));
  } catch (err) {
    console.error('获取统计数据失败:', err);
    res.status(500).json(error('获取统计数据失败'));
  }
});

/**
 * 添加电影
 * POST /api/admin/movies
 */
router.post('/movies', async (req, res) => {
  try {
    const movieData = req.body;
    
    // 验证必填字段
    if (!movieData.title) {
      return res.status(400).json(error('电影标题不能为空'));
    }
    
    const movie = await adminService.addMovie(movieData);
    res.json(success(movie, '电影添加成功'));
  } catch (err) {
    console.error('添加电影失败:', err);
    res.status(500).json(error('添加电影失败'));
  }
});

/**
 * 更新电影
 * PUT /api/admin/movies/:id
 */
router.put('/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    const movieData = req.body;
    
    const result = await adminService.updateMovie(movieId, movieData);
    
    if (result.success === false) {
      return res.status(404).json(error(result.message));
    }
    
    res.json(success(result, '电影更新成功'));
  } catch (err) {
    console.error('更新电影失败:', err);
    res.status(500).json(error('更新电影失败'));
  }
});

/**
 * 删除电影
 * DELETE /api/admin/movies/:id
 */
router.delete('/movies/:id', async (req, res) => {
  try {
    const movieId = req.params.id;
    
    const result = await adminService.deleteMovie(movieId);
    
    if (result.success === false) {
      return res.status(404).json(error(result.message));
    }
    
    res.json(success(null, '电影删除成功'));
  } catch (err) {
    console.error('删除电影失败:', err);
    res.status(500).json(error('删除电影失败'));
  }
});

/**
 * 获取用户列表
 * GET /api/admin/users
 */
router.get('/users', async (req, res) => {
  try {
    const { page = 1, limit = 20, keyword } = req.query;
    
    const result = await adminService.getUserList(page, limit, keyword);
    res.json(success(result));
  } catch (err) {
    console.error('获取用户列表失败:', err);
    res.status(500).json(error('获取用户列表失败'));
  }
});

/**
 * 更新用户状态
 * PATCH /api/admin/users/:id/status
 */
router.patch('/users/:id/status', async (req, res) => {
  try {
    const userId = req.params.id;
    const { status } = req.body;
    
    if (status === undefined || ![0, 1].includes(status)) {
      return res.status(400).json(error('状态值无效'));
    }
    
    const result = await adminService.updateUserStatus(userId, status);
    
    if (result.success === false) {
      return res.status(400).json(error(result.message));
    }
    
    res.json(success(null, result.message));
  } catch (err) {
    console.error('更新用户状态失败:', err);
    res.status(500).json(error('更新用户状态失败'));
  }
});

module.exports = router;
