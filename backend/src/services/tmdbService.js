/**
 * TMDB API服务
 * 用于从The Movie Database获取电影数据
 */
const cache = require('../utils/cache');
const rateLimiter = require('../utils/rateLimiter');
const imageHelper = require('../utils/imageHelper');

class TMDBService {
  constructor() {
    this.apiKey = process.env.TMDB_API_KEY;
    this.baseUrl = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

    if (!this.apiKey || this.apiKey === 'your_tmdb_api_key_here') {
      console.warn('⚠️ TMDB API Key未配置，请设置环境变量 TMDB_API_KEY');
    }
  }

  /**
   * 发送API请求
   */
  async request(endpoint, params = {}) {
    // 检查API Key
    if (!this.apiKey || this.apiKey === 'your_tmdb_api_key_here') {
      throw new Error('TMDB API Key未配置');
    }

    // 添加API Key
    const queryParams = new URLSearchParams({
      api_key: this.apiKey,
      ...params
    });

    const url = `${this.baseUrl}${endpoint}?${queryParams}`;

    // 生成缓存键
    const cacheKey = cache.generateKey('tmdb', { endpoint, ...params });

    // 尝试从缓存获取
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      console.log(`✅ 从缓存获取: ${endpoint}`);
      return cachedData;
    }

    // 等待限流
    await rateLimiter.waitForNextRequest();

    try {
      console.log(`🌐 请求TMDB API: ${endpoint}`);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`TMDB API错误: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();

      // 缓存结果
      cache.set(cacheKey, data);

      return data;
    } catch (error) {
      console.error(`❌ TMDB API请求失败: ${endpoint}`, error.message);
      throw error;
    }
  }

  /**
   * 获取电影列表
   */
  async getMovies(options = {}) {
    const {
      page = 1,
      genreId = null,
      sortBy = 'popularity.desc',
      query = null
    } = options;

    let endpoint, params;

    if (query) {
      // 搜索电影
      endpoint = '/search/movie';
      params = { page, query };
    } else {
      // 发现电影
      endpoint = '/discover/movie';
      params = { page, sort_by: sortBy };

      if (genreId) {
        params.with_genres = genreId;
      }
    }

    const data = await this.request(endpoint, params);

    // 转换数据格式
    return {
      movies: data.results.map(movie => this.transformMovie(movie)),
      total: data.total_results,
      page: data.page,
      totalPages: data.total_pages
    };
  }

  /**
   * 获取电影详情
   */
  async getMovieById(movieId) {
    const data = await this.request(`/movie/${movieId}`);
    return this.transformMovie(data, true);
  }

  /**
   * 获取热门电影
   */
  async getPopularMovies(page = 1) {
    const data = await this.request('/movie/popular', { page });
    return {
      movies: data.results.map(movie => this.transformMovie(movie)),
      total: data.total_results,
      page: data.page,
      totalPages: data.total_pages
    };
  }

  /**
   * 获取电影分类列表
   */
  async getGenres() {
    const data = await this.request('/genre/movie/list');
    return data.genres.map(genre => ({
      id: genre.id,
      name: genre.name
    }));
  }

  /**
   * 转换TMDB电影数据为本地格式
   */
  transformMovie(tmdbMovie, detailed = false) {
    const movie = {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      poster: imageHelper.getPosterUrl(tmdbMovie.poster_path),
      description: tmdbMovie.overview || '暂无简介',
      rating: tmdbMovie.vote_average || 0,
      ratingCount: tmdbMovie.vote_count || 0,
      releaseDate: tmdbMovie.release_date ? new Date(tmdbMovie.release_date) : null,
      genres: []
    };

    // 处理分类
    if (tmdbMovie.genre_ids) {
      movie.genreIds = tmdbMovie.genre_ids;
    } else if (tmdbMovie.genres) {
      movie.genres = tmdbMovie.genres.map(g => ({ id: g.id, name: g.name }));
      movie.genreIds = tmdbMovie.genres.map(g => g.id);
    }

    // 详细信息
    if (detailed) {
      movie.duration = tmdbMovie.runtime || 0;
      movie.director = this.extractDirector(tmdbMovie.credits);
      movie.backdrop = imageHelper.getBackdropUrl(tmdbMovie.backdrop_path);
      movie.budget = tmdbMovie.budget;
      movie.revenue = tmdbMovie.revenue;
      movie.status = tmdbMovie.status;
      movie.tagline = tmdbMovie.tagline;
    }

    return movie;
  }

  /**
   * 提取导演信息
   */
  extractDirector(credits) {
    if (!credits || !credits.crew) return null;

    const director = credits.crew.find(person => person.job === 'Director');
    return director ? director.name : null;
  }

  /**
   * 搜索电影
   */
  async searchMovies(query, page = 1) {
    return this.getMovies({ query, page });
  }

  /**
   * 获取类似电影推荐
   */
  async getSimilarMovies(movieId, page = 1) {
    const data = await this.request(`/movie/${movieId}/similar`, { page });
    return {
      movies: data.results.map(movie => this.transformMovie(movie)),
      total: data.total_results,
      page: data.page,
      totalPages: data.total_pages
    };
  }

  /**
   * 获取电影视频（预告片等）
   */
  async getMovieVideos(movieId) {
    const data = await this.request(`/movie/${movieId}/videos`);
    return data.results;
  }

  /**
   * 获取缓存统计
   */
  getCacheStats() {
    return cache.getStats();
  }

  /**
   * 获取限流统计
   */
  getRateLimitStats() {
    return rateLimiter.getStats();
  }

  /**
   * 清空缓存
   */
  clearCache() {
    cache.clear();
    console.log('✅ TMDB缓存已清空');
  }
}

// 单例模式
const tmdbService = new TMDBService();

module.exports = tmdbService;
