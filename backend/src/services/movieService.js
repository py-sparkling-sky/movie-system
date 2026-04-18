const { Movie, Genre, MovieGenre, sequelize } = require('../models');

/**
 * 获取电影列表
 */
exports.getMovies = async (page = 1, limit = 20, genre = null, keyword = null, sort = 'created_at') => {
  const offset = (page - 1) * limit;
  
  const where = { status: 1 };
  
  if (keyword) {
    where[sequelize.Op.or] = [
      { title: { [sequelize.Op.like]: `%${keyword}%` } },
      { director: { [sequelize.Op.like]: `%${keyword}%` } }
    ];
  }
  
  let order = [['created_at', 'DESC']];
  if (sort === 'rating') {
    order = [['rating', 'DESC']];
  } else if (sort === 'view_count') {
    order = [['view_count', 'DESC']];
  }
  
  const include = [{
    model: Genre,
    as: 'genres',
    through: { attributes: [] }
  }];
  
  if (genre) {
    include[0].where = { name: genre };
  }
  
  const result = await Movie.findAndCountAll({
    where,
    include,
    order,
    limit,
    offset,
    distinct: true
  });
  
  return {
    movies: result.rows,
    total: result.count,
    page,
    limit,
    totalPages: Math.ceil(result.count / limit)
  };
};

/**
 * 获取电影详情
 */
exports.getMovieById = async (id) => {
  const movie = await Movie.findByPk(id, {
    include: [{
      model: Genre,
      as: 'genres',
      through: { attributes: [] }
    }]
  });
  
  return movie;
};

/**
 * 获取热门电影
 */
exports.getHotMovies = async (limit = 10) => {
  const movies = await Movie.findAll({
    where: { status: 1 },
    order: [['view_count', 'DESC']],
    limit,
    include: [{
      model: Genre,
      as: 'genres',
      through: { attributes: [] }
    }]
  });
  
  return movies;
};

/**
 * 增加观看次数
 */
exports.incrementViewCount = async (id) => {
  await Movie.increment('view_count', { where: { id } });
};
