/**
 * TMDB服务测试
 */
const assert = require('assert');
const tmdbService = require('../src/services/tmdbService');

describe('TMDB Service Tests', function() {
  // 增加超时时间，因为涉及网络请求
  this.timeout(10000);

  describe('getGenres()', function() {
    it('应该成功获取电影分类列表', async function() {
      try {
        const genres = await tmdbService.getGenres();

        assert.ok(Array.isArray(genres), '返回结果应该是数组');
        assert.ok(genres.length > 0, '分类列表不应为空');
        assert.ok(genres[0].id, '分类应该包含id');
        assert.ok(genres[0].name, '分类应该包含name');

        console.log(`✅ 获取到 ${genres.length} 个分类`);
      } catch (error) {
        if (error.message.includes('API Key未配置')) {
          this.skip(); // 跳过测试
        } else {
          throw error;
        }
      }
    });
  });

  describe('getMovies()', function() {
    it('应该成功获取电影列表', async function() {
      try {
        const result = await tmdbService.getMovies({ page: 1 });

        assert.ok(result.movies, '应该包含movies字段');
        assert.ok(Array.isArray(result.movies), 'movies应该是数组');
        assert.ok(result.total > 0, '总数应该大于0');
        assert.ok(result.page === 1, '页码应该是1');

        if (result.movies.length > 0) {
          const movie = result.movies[0];
          assert.ok(movie.id, '电影应该包含id');
          assert.ok(movie.title, '电影应该包含title');
          assert.ok(movie.poster, '电影应该包含poster');
        }

        console.log(`✅ 获取到 ${result.movies.length} 部电影，总数: ${result.total}`);
      } catch (error) {
        if (error.message.includes('API Key未配置')) {
          this.skip();
        } else {
          throw error;
        }
      }
    });

    it('应该支持按分类筛选', async function() {
      try {
        // 先获取分类列表
        const genres = await tmdbService.getGenres();
        if (genres.length === 0) {
          this.skip();
          return;
        }

        const genreId = genres[0].id;
        const result = await tmdbService.getMovies({ page: 1, genreId });

        assert.ok(result.movies, '应该返回电影列表');
        console.log(`✅ 按分类 ${genres[0].name} 筛选，获取到 ${result.movies.length} 部电影`);
      } catch (error) {
        if (error.message.includes('API Key未配置')) {
          this.skip();
        } else {
          throw error;
        }
      }
    });

    it('应该支持搜索功能', async function() {
      try {
        const result = await tmdbService.getMovies({ query: 'avatar', page: 1 });

        assert.ok(result.movies, '应该返回搜索结果');
        console.log(`✅ 搜索 'avatar'，找到 ${result.movies.length} 部电影`);
      } catch (error) {
        if (error.message.includes('API Key未配置')) {
          this.skip();
        } else {
          throw error;
        }
      }
    });
  });

  describe('getPopularMovies()', function() {
    it('应该成功获取热门电影', async function() {
      try {
        const result = await tmdbService.getPopularMovies(1);

        assert.ok(result.movies, '应该包含movies字段');
        assert.ok(Array.isArray(result.movies), 'movies应该是数组');
        assert.ok(result.movies.length > 0, '应该返回热门电影');

        console.log(`✅ 获取到 ${result.movies.length} 部热门电影`);
      } catch (error) {
        if (error.message.includes('API Key未配置')) {
          this.skip();
        } else {
          throw error;
        }
      }
    });
  });

  describe('getMovieById()', function() {
    it('应该成功获取电影详情', async function() {
      try {
        // 先获取一个电影ID
        const movies = await tmdbService.getMovies({ page: 1 });
        if (movies.movies.length === 0) {
          this.skip();
          return;
        }

        const movieId = movies.movies[0].id;
        const movie = await tmdbService.getMovieById(movieId);

        assert.ok(movie, '应该返回电影详情');
        assert.ok(movie.id === movieId, 'ID应该匹配');
        assert.ok(movie.title, '应该包含标题');
        assert.ok(movie.description, '应该包含简介');

        console.log(`✅ 获取电影详情: ${movie.title}`);
      } catch (error) {
        if (error.message.includes('API Key未配置')) {
          this.skip();
        } else {
          throw error;
        }
      }
    });
  });

  describe('缓存功能', function() {
    it('缓存统计应该正常工作', function() {
      const stats = tmdbService.getCacheStats();

      assert.ok(stats, '应该返回统计信息');
      assert.ok(typeof stats.enabled === 'boolean', '应该包含enabled字段');
      assert.ok(typeof stats.size === 'number', '应该包含size字段');

      console.log(`✅ 缓存统计:`, stats);
    });

    it('清空缓存应该正常工作', function() {
      tmdbService.clearCache();
      const stats = tmdbService.getCacheStats();

      assert.ok(stats.size === 0, '缓存应该被清空');
      console.log(`✅ 缓存已清空`);
    });
  });

  describe('限流功能', function() {
    it('限流统计应该正常工作', function() {
      const stats = tmdbService.getRateLimitStats();

      assert.ok(stats, '应该返回统计信息');
      assert.ok(typeof stats.requestsInLastMinute === 'number', '应该包含requestsInLastMinute');
      assert.ok(typeof stats.maxRequestsPerMinute === 'number', '应该包含maxRequestsPerMinute');

      console.log(`✅ 限流统计:`, stats);
    });
  });
});
