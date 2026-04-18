const { Favorite, WatchRecord, Movie, Genre } = require('../models');

/**
 * 添加收藏
 */
exports.addFavorite = async (userId, movieId) => {
  // 检查电影是否存在
  const movie = await Movie.findByPk(movieId);
  if (!movie || movie.status === 0) {
    throw new Error('电影不存在或已下架');
  }
  
  // 检查是否已收藏
  const existFavorite = await Favorite.findOne({
    where: { user_id: userId, movie_id: movieId }
  });
  
  if (existFavorite) {
    throw new Error('已收藏该电影');
  }
  
  // 创建收藏
  const favorite = await Favorite.create({
    user_id: userId,
    movie_id: movieId
  });
  
  return favorite;
};

/**
 * 取消收藏
 */
exports.removeFavorite = async (userId, movieId) => {
  const result = await Favorite.destroy({
    where: { user_id: userId, movie_id: movieId }
  });
  
  if (result === 0) {
    throw new Error('未收藏该电影');
  }
  
  return true;
};

/**
 * 获取收藏列表
 */
exports.getFavorites = async (userId, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  
  const result = await Favorite.findAndCountAll({
    where: { user_id: userId },
    include: [{
      model: Movie,
      as: 'movie',
      include: [{
        model: Genre,
        as: 'genres',
        through: { attributes: [] }
      }]
    }],
    order: [['created_at', 'DESC']],
    limit,
    offset
  });
  
  return {
    favorites: result.rows,
    total: result.count,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit)
  };
};

/**
 * 检查是否已收藏
 */
exports.checkFavorite = async (userId, movieId) => {
  const favorite = await Favorite.findOne({
    where: { user_id: userId, movie_id: movieId }
  });
  
  return !!favorite;
};

/**
 * 创建或更新观影记录
 */
exports.updateWatchRecord = async (userId, movieId, progress = 0, duration = 0) => {
  const [record, created] = await WatchRecord.findOrCreate({
    where: { user_id: userId, movie_id: movieId },
    defaults: {
      user_id: userId,
      movie_id: movieId,
      progress,
      duration,
      last_watched_at: new Date()
    }
  });
  
  if (!created) {
    await record.update({
      progress,
      duration,
      last_watched_at: new Date()
    });
  }
  
  return record;
};

/**
 * 获取观影记录
 */
exports.getWatchRecords = async (userId, page = 1, limit = 20) => {
  const offset = (page - 1) * limit;
  
  const result = await WatchRecord.findAndCountAll({
    where: { user_id: userId },
    include: [{
      model: Movie,
      as: 'movie',
      include: [{
        model: Genre,
        as: 'genres',
        through: { attributes: [] }
      }]
    }],
    order: [['last_watched_at', 'DESC']],
    limit,
    offset
  });
  
  return {
    records: result.rows,
    total: result.count,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit)
  };
};
