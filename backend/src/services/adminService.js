const db = require('../models');
const { Op } = require('sequelize');

/**
 * 管理员服务
 */
class AdminService {
  /**
   * 添加电影
   */
  async addMovie(movieData) {
    const { title, poster, description, director, release_date, duration, rating, genres } = movieData;
    
    // 创建电影
    const movie = await db.Movie.create({
      title,
      poster,
      description,
      director,
      release_date,
      duration,
      rating: rating || 0,
      view_count: 0
    });
    
    // 如果有分类，建立关联
    if (genres && genres.length > 0) {
      const genreRecords = await db.Genre.findAll({
        where: { name: { [Op.in]: genres } }
      });
      await movie.setGenres(genreRecords);
    }
    
    // 返回完整电影信息
    return await db.Movie.findByPk(movie.id, {
      include: [{ model: db.Genre, as: 'Genres', attributes: ['id', 'name'] }]
    });
  }

  /**
   * 更新电影
   */
  async updateMovie(movieId, movieData) {
    const movie = await db.Movie.findByPk(movieId);
    
    if (!movie) {
      return { success: false, message: '电影不存在' };
    }
    
    const { title, poster, description, director, release_date, duration, rating, genres } = movieData;
    
    // 更新电影基本信息
    await movie.update({
      title: title || movie.title,
      poster: poster || movie.poster,
      description: description || movie.description,
      director: director || movie.director,
      release_date: release_date || movie.release_date,
      duration: duration || movie.duration,
      rating: rating !== undefined ? rating : movie.rating
    });
    
    // 如果有分类，更新关联
    if (genres && Array.isArray(genres)) {
      const genreRecords = await db.Genre.findAll({
        where: { name: { [Op.in]: genres } }
      });
      await movie.setGenres(genreRecords);
    }
    
    // 返回更新后的电影信息
    return await db.Movie.findByPk(movieId, {
      include: [{ model: db.Genre, as: 'Genres', attributes: ['id', 'name'] }]
    });
  }

  /**
   * 删除电影
   */
  async deleteMovie(movieId) {
    const movie = await db.Movie.findByPk(movieId);
    
    if (!movie) {
      return { success: false, message: '电影不存在' };
    }
    
    // 删除关联
    await movie.setGenres([]);
    
    // 删除电影
    await movie.destroy();
    
    return { success: true, message: '删除成功' };
  }

  /**
   * 获取所有用户列表
   */
  async getUserList(page = 1, limit = 20, keyword = '') {
    const offset = (page - 1) * limit;
    const where = {};
    
    if (keyword) {
      where[Op.or] = [
        { username: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } },
        { nickname: { [Op.like]: `%${keyword}%` } }
      ];
    }
    
    const { count, rows } = await db.User.findAndCountAll({
      where,
      attributes: ['id', 'username', 'email', 'nickname', 'avatar', 'role', 'status', 'createdAt'],
      order: [['createdAt', 'DESC']],
      limit: parseInt(limit),
      offset: offset
    });
    
    return {
      total: count,
      page: parseInt(page),
      limit: parseInt(limit),
      users: rows
    };
  }

  /**
   * 更新用户状态
   */
  async updateUserStatus(userId, status) {
    const user = await db.User.findByPk(userId);
    
    if (!user) {
      return { success: false, message: '用户不存在' };
    }
    
    // 不能修改管理员状态
    if (user.role === 1) {
      return { success: false, message: '不能修改管理员状态' };
    }
    
    await user.update({ status });
    
    return { success: true, message: '状态更新成功' };
  }

  /**
   * 获取统计数据
   */
  async getStatistics() {
    // 电影总数
    const movieCount = await db.Movie.count();
    
    // 用户总数
    const userCount = await db.User.count();
    
    // 收藏总数
    const favoriteCount = await db.Favorite.count();
    
    // 观影记录总数
    const recordCount = await db.WatchRecord.count();
    
    // 今日新增用户
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayNewUsers = await db.User.count({
      where: { createdAt: { [Op.gte]: today } }
    });
    
    // 热门电影Top5
    const hotMovies = await db.Movie.findAll({
      order: [['view_count', 'DESC']],
      limit: 5,
      attributes: ['id', 'title', 'view_count', 'rating']
    });
    
    return {
      movieCount,
      userCount,
      favoriteCount,
      recordCount,
      todayNewUsers,
      hotMovies
    };
  }
}

module.exports = new AdminService();
