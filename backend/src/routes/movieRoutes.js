const express = require('express');
const router = express.Router();
const movieService = require('../services/movieService');
const { success, error, notFound } = require('../utils/response');

/**
 * 获取电影列表
 * GET /api/movies
 */
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, genre, keyword, sort } = req.query;
    const result = await movieService.getMovies(
      parseInt(page),
      parseInt(limit),
      genre,
      keyword,
      sort
    );
    res.json(success(result));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
});

/**
 * 获取热门电影
 * GET /api/movies/hot
 */
router.get('/hot', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const movies = await movieService.getHotMovies(parseInt(limit));
    res.json(success(movies));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
});

/**
 * 获取电影详情
 * GET /api/movies/:id
 */
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await movieService.getMovieById(parseInt(id));
    
    if (!movie) {
      return res.status(404).json(notFound('电影不存在'));
    }
    
    // 增加观看次数
    await movieService.incrementViewCount(parseInt(id));
    
    res.json(success(movie));
  } catch (err) {
    res.status(500).json(error(err.message));
  }
});

module.exports = router;
