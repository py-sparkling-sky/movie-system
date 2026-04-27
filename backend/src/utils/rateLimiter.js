/**
 * API限流器
 * 用于控制TMDB API调用频率，避免超过限流限制
 */
class RateLimiter {
  constructor() {
    this.requests = [];
    this.maxRequestsPerMinute = parseInt(process.env.TMDB_MAX_REQUESTS_PER_MINUTE) || 40;
    this.requestInterval = parseInt(process.env.TMDB_REQUEST_INTERVAL) || 250; // 毫秒
    this.lastRequestTime = 0;
  }

  /**
   * 等待直到可以发送下一个请求
   */
  async waitForNextRequest() {
    const now = Date.now();

    // 清理1分钟前的请求记录
    this.requests = this.requests.filter(time => now - time < 60000);

    // 检查是否超过每分钟限制
    if (this.requests.length >= this.maxRequestsPerMinute) {
      const oldestRequest = this.requests[0];
      const waitTime = 60000 - (now - oldestRequest) + 100;
      console.log(`⚠️ 达到限流限制，等待 ${waitTime}ms`);
      await this.sleep(waitTime);
    }

    // 确保请求间隔
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.requestInterval) {
      await this.sleep(this.requestInterval - timeSinceLastRequest);
    }

    // 记录本次请求
    this.lastRequestTime = Date.now();
    this.requests.push(this.lastRequestTime);
  }

  /**
   * 休眠函数
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * 获取限流统计信息
   */
  getStats() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < 60000);
    return {
      requestsInLastMinute: this.requests.length,
      maxRequestsPerMinute: this.maxRequestsPerMinute,
      requestInterval: this.requestInterval
    };
  }
}

// 单例模式
const rateLimiter = new RateLimiter();

module.exports = rateLimiter;
