const express = require('express');
const router = express.Router();
const watchService = require('../services/watchService');
const { auth } = require('../middlewares/auth');
const { success, error } = require('../utils/response');

/**
 * 添加收藏
 * POST /api/watch/favorites
 */
router.post('/favorites', auth, async (req, res) => {
  try {
    const { movieId } = req.body;
    const favorite = await watchService.addFavorite(req.user.id, movieId);
    res.json(success(favorite, '收藏成功'));
  } catch (err) {
    res.status(400).json(error(err.message, 400));
  }
});

/**
 * 取消收藏
 * DELETE /api/watch/favorites/:movieId
 */
router.delete('/favorites/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    await watchService.removeFavorite(req.user.id, parseInt(movieId));
    res.json(success(null, '取消收藏成功'));
  } catch (err) {
    res.status(400).json(error(err.message, 400));
  }
});

/**
 * 获取收藏列表
 * GET /api/watch/favorites
 */
router.get('/favorites', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await watchService.getFavorites(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );
    res.json(success(result));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
});

/**
 * 检查是否已收藏
 * GET /api/watch/favorites/check/:movieId
 */
router.get('/favorites/check/:movieId', auth, async (req, res) => {
  try {
    const { movieId } = req.params;
    const isFavorited = await watchService.checkFavorite(req.user.id, parseInt(movieId));
    res.json(success({ isFavorited }));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
});

/**
 * 更新观影记录
 * POST /api/watch/records
 */
router.post('/records', auth, async (req, res) => {
  try {
    const { movieId, progress, duration } = req.body;
    const record = await watchService.updateWatchRecord(
      req.user.id,
      movieId,
      progress,
      duration
    );
    res.json(success(record));
  } catch (err) {
    res.status(400).json(error(err.message, 400));
  }
});

/**
 * 获取观影记录
 * GET /api/watch/records
 */
router.get('/records', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const result = await watchService.getWatchRecords(
      req.user.id,
      parseInt(page),
      parseInt(limit)
    );
    res.json(success(result));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
});

module.exports = router;
