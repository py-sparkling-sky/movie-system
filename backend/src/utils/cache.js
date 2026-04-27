/**
 * 缓存管理器
 * 用于缓存TMDB API响应，减少API调用次数
 */
class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttl = parseInt(process.env.CACHE_TTL) || 3600; // 默认1小时
    this.enabled = process.env.CACHE_ENABLED !== 'false'; // 默认启用
  }

  /**
   * 生成缓存键
   */
  generateKey(prefix, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}=${params[key]}`)
      .join('&');
    return `${prefix}:${sortedParams}`;
  }

  /**
   * 获取缓存
   */
  get(key) {
    if (!this.enabled) return null;

    const item = this.cache.get(key);
    if (!item) return null;

    // 检查是否过期
    if (Date.now() > item.expireTime) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  /**
   * 设置缓存
   */
  set(key, data, customTTL = null) {
    if (!this.enabled) return;

    const ttl = customTTL || this.ttl;
    this.cache.set(key, {
      data,
      expireTime: Date.now() + ttl * 1000
    });
  }

  /**
   * 删除缓存
   */
  delete(key) {
    this.cache.delete(key);
  }

  /**
   * 清空所有缓存
   */
  clear() {
    this.cache.clear();
  }

  /**
   * 获取缓存统计信息
   */
  getStats() {
    return {
      enabled: this.enabled,
      size: this.cache.size,
      ttl: this.ttl
    };
  }

  /**
   * 清理过期缓存
   */
  cleanup() {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expireTime) {
        this.cache.delete(key);
      }
    }
  }
}

// 单例模式
const cacheManager = new CacheManager();

// 定期清理过期缓存（每10分钟）
setInterval(() => {
  cacheManager.cleanup();
}, 10 * 60 * 1000);

module.exports = cacheManager;
