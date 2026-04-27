/**
 * 限流器测试
 */
const assert = require('assert');
const rateLimiter = require('../src/utils/rateLimiter');

describe('Rate Limiter Tests', function() {
  // 增加超时时间
  this.timeout(5000);

  describe('基本功能', function() {
    it('应该正确初始化', function() {
      const stats = rateLimiter.getStats();

      assert.ok(stats, '应该返回统计信息');
      assert.ok(typeof stats.requestsInLastMinute === 'number', '应该包含requestsInLastMinute');
      assert.ok(typeof stats.maxRequestsPerMinute === 'number', '应该包含maxRequestsPerMinute');
      assert.ok(typeof stats.requestInterval === 'number', '应该包含requestInterval');
    });
  });

  describe('限流控制', function() {
    it('应该正确记录请求', async function() {
      const beforeStats = rateLimiter.getStats();
      const beforeCount = beforeStats.requestsInLastMinute;

      await rateLimiter.waitForNextRequest();

      const afterStats = rateLimiter.getStats();

      assert.strictEqual(afterStats.requestsInLastMinute, beforeCount + 1, '请求数应该增加1');
    });

    it('连续请求应该遵守间隔时间', async function() {
      const startTime = Date.now();

      await rateLimiter.waitForNextRequest();
      await rateLimiter.waitForNextRequest();

      const endTime = Date.now();
      const elapsed = endTime - startTime;

      // 两次请求之间应该至少有requestInterval的间隔
      assert.ok(elapsed >= rateLimiter.requestInterval, '应该遵守请求间隔');
    });
  });

  describe('统计信息', function() {
    it('应该正确返回统计信息', function() {
      const stats = rateLimiter.getStats();

      assert.ok(stats.requestsInLastMinute >= 0, '请求数应该大于等于0');
      assert.ok(stats.maxRequestsPerMinute > 0, '最大请求数应该大于0');
      assert.ok(stats.requestInterval > 0, '请求间隔应该大于0');

      console.log(`✅ 限流统计:`, stats);
    });
  });
});
