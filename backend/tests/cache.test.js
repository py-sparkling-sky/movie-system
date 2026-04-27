/**
 * 缓存管理器测试
 */
const assert = require('assert');
const cache = require('../src/utils/cache');

describe('Cache Manager Tests', function() {
  beforeEach(function() {
    // 每个测试前清空缓存
    cache.clear();
  });

  describe('基本功能', function() {
    it('应该正确设置和获取缓存', function() {
      const key = 'test-key';
      const data = { name: 'test', value: 123 };

      cache.set(key, data);
      const result = cache.get(key);

      assert.deepStrictEqual(result, data, '获取的数据应该与设置的数据相同');
    });

    it('获取不存在的缓存应该返回null', function() {
      const result = cache.get('non-existent-key');
      assert.strictEqual(result, null, '不存在的缓存应该返回null');
    });

    it('应该正确删除缓存', function() {
      const key = 'test-key';
      const data = { name: 'test' };

      cache.set(key, data);
      cache.delete(key);
      const result = cache.get(key);

      assert.strictEqual(result, null, '删除后应该返回null');
    });

    it('应该正确清空所有缓存', function() {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');
      cache.set('key3', 'value3');

      cache.clear();
      const stats = cache.getStats();

      assert.strictEqual(stats.size, 0, '清空后缓存数量应该为0');
    });
  });

  describe('缓存键生成', function() {
    it('应该正确生成缓存键', function() {
      const key1 = cache.generateKey('prefix', { a: 1, b: 2 });
      const key2 = cache.generateKey('prefix', { b: 2, a: 1 });

      assert.strictEqual(key1, key2, '相同参数不同顺序应该生成相同的键');
    });

    it('不同参数应该生成不同的键', function() {
      const key1 = cache.generateKey('prefix', { a: 1 });
      const key2 = cache.generateKey('prefix', { a: 2 });

      assert.notStrictEqual(key1, key2, '不同参数应该生成不同的键');
    });
  });

  describe('TTL过期', function() {
    it('缓存应该在TTL后过期', function(done) {
      // 设置1秒过期的缓存
      cache.set('test-key', 'test-value', 1);

      setTimeout(function() {
        const result = cache.get('test-key');
        assert.strictEqual(result, null, '过期后应该返回null');
        done();
      }, 1100);
    });

    it('未过期的缓存应该可以正常获取', function(done) {
      cache.set('test-key', 'test-value', 5);

      setTimeout(function() {
        const result = cache.get('test-key');
        assert.strictEqual(result, 'test-value', '未过期应该返回正确值');
        done();
      }, 100);
    });
  });

  describe('统计信息', function() {
    it('应该正确返回统计信息', function() {
      cache.set('key1', 'value1');
      cache.set('key2', 'value2');

      const stats = cache.getStats();

      assert.ok(stats, '应该返回统计信息');
      assert.ok(typeof stats.enabled === 'boolean', '应该包含enabled字段');
      assert.ok(typeof stats.size === 'number', '应该包含size字段');
      assert.ok(typeof stats.ttl === 'number', '应该包含ttl字段');
      assert.strictEqual(stats.size, 2, '缓存数量应该是2');
    });
  });

  describe('缓存禁用', function() {
    it('禁用缓存时不应该存储数据', function() {
      const originalEnabled = cache.enabled;
      cache.enabled = false;

      cache.set('test-key', 'test-value');
      const result = cache.get('test-key');

      assert.strictEqual(result, null, '禁用缓存时应该返回null');

      // 恢复原始状态
      cache.enabled = originalEnabled;
    });
  });

  describe('清理过期缓存', function() {
    it('应该正确清理过期缓存', function(done) {
      // 设置一个很快过期的缓存
      cache.set('key1', 'value1', 1);
      cache.set('key2', 'value2', 10);

      setTimeout(function() {
        cache.cleanup();
        const stats = cache.getStats();

        assert.strictEqual(stats.size, 1, '应该只剩1个缓存');
        done();
      }, 1100);
    });
  });
});
