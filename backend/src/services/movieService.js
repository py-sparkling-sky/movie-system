const { Movie, Genre, MovieGenre, sequelize } = require('../models');
const tmdbService = require('./tmdbService');

// 是否使用TMDB API
const USE_TMDB = process.env.TMDB_API_KEY && process.env.TMDB_API_KEY !== 'your_tmdb_api_key_here';

/**
 * 获取电影列表
 */
exports.getMovies = async (page = 1, limit = 20, genre = null, keyword = null, sort = 'created_at') => {
  // 如果配置了TMDB，优先使用TMDB
  if (USE_TMDB) {
    try {
      console.log('🎬 使用TMDB API获取电影列表');

      // 转换排序参数
      let sortBy = 'popularity.desc';
      if (sort === 'rating') {
        sortBy = 'vote_average.desc';
      } else if (sort === 'view_count') {
        sortBy = 'popularity.desc';
      }

      // 获取分类ID
      let genreId = null;
      if (genre) {
        const genres = await tmdbService.getGenres();
        const genreObj = genres.find(g => g.name === genre);
        if (genreObj) {
          genreId = genreObj.id;
        }
      }

      const result = await tmdbService.getMovies({
        page,
        genreId,
        sortBy,
        query: keyword
      });

      return {
        movies: result.movies,
        total: result.total,
        page: result.page,
        limit: 20,
        totalPages: result.totalPages
      };
    } catch (error) {
      console.error('❌ TMDB API调用失败，降级到本地数据库:', error.message);
      // 降级到本地数据库
      return await getMoviesFromDB(page, limit, genre, keyword, sort);
    }
  }

  // 使用本地数据库
  return await getMoviesFromDB(page, limit, genre, keyword, sort);
};

/**
 * 从本地数据库获取电影列表
 */
async function getMoviesFromDB(page = 1, limit = 20, genre = null, keyword = null, sort = 'created_at') {
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
}

/**
 * 获取电影详情
 */
exports.getMovieById = async (id) => {
  // 如果配置了TMDB，优先使用TMDB
  if (USE_TMDB) {
    try {
      console.log('🎬 使用TMDB API获取电影详情');
      return await tmdbService.getMovieById(id);
    } catch (error) {
      console.error('❌ TMDB API调用失败，降级到本地数据库:', error.message);
      // 降级到本地数据库
      return await getMovieByIdFromDB(id);
    }
  }

  // 使用本地数据库
  return await getMovieByIdFromDB(id);
};

/**
 * 从本地数据库获取电影详情
 */
async function getMovieByIdFromDB(id) {
  const movie = await Movie.findByPk(id, {
    include: [{
      model: Genre,
      as: 'genres',
      through: { attributes: [] }
    }]
  });

  return movie;
}

/**
 * 获取热门电影
 */
exports.getHotMovies = async (limit = 10) => {
  // 如果配置了TMDB，优先使用TMDB
  if (USE_TMDB) {
    try {
      console.log('🎬 使用TMDB API获取热门电影');
      const result = await tmdbService.getPopularMovies(1);
      return result.movies.slice(0, limit);
    } catch (error) {
      console.error('❌ TMDB API调用失败，降级到本地数据库:', error.message);
      // 降级到本地数据库
      return await getHotMoviesFromDB(limit);
    }
  }

  // 使用本地数据库
  return await getHotMoviesFromDB(limit);
};

/**
 * 从本地数据库获取热门电影
 */
async function getHotMoviesFromDB(limit = 10) {
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
}

/**
 * 增加观看次数
 */
exports.incrementViewCount = async (id) => {
  // TMDB不支持修改观看次数，只在本地数据库记录
  try {
    await Movie.increment('view_count', { where: { id } });
  } catch (error) {
    console.error('增加观看次数失败:', error.message);
  }
};

/**
 * 获取所有分类
 */
exports.getGenres = async () => {
  if (USE_TMDB) {
    try {
      return await tmdbService.getGenres();
    } catch (error) {
      console.error('❌ TMDB获取分类失败:', error.message);
      return await Genre.findAll();
    }
  }

  return await Genre.findAll();
};

/**
 * 获取TMDB缓存统计
 */
exports.getTMDBStats = () => {
  if (USE_TMDB) {
    return {
      cache: tmdbService.getCacheStats(),
      rateLimit: tmdbService.getRateLimitStats()
    };
  }
  return null;
};
