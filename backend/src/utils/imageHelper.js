/**
 * 图片URL辅助工具
 * 用于处理TMDB图片URL
 */
class ImageHelper {
  constructor() {
    this.imageBaseUrl = process.env.TMDB_IMAGE_BASE_URL || 'https://image.tmdb.org/t/p';
  }

  /**
   * 获取完整图片URL
   * @param {string} path - 图片路径（如：/abc123.jpg）
   * @param {string} size - 图片尺寸（w200, w300, w500, w780, original）
   */
  getFullUrl(path, size = 'w500') {
    if (!path) {
      // 返回默认占位图
      return 'https://via.placeholder.com/500x750?text=No+Image';
    }

    // 如果已经是完整URL，直接返回
    if (path.startsWith('http')) {
      return path;
    }

    return `${this.imageBaseUrl}/${size}${path}`;
  }

  /**
   * 获取海报URL（中等尺寸）
   */
  getPosterUrl(path) {
    return this.getFullUrl(path, 'w500');
  }

  /**
   * 获取海报URL（大尺寸）
   */
  getLargePosterUrl(path) {
    return this.getFullUrl(path, 'w780');
  }

  /**
   * 获取海报URL（小尺寸）
   */
  getSmallPosterUrl(path) {
    return this.getFullUrl(path, 'w200');
  }

  /**
   * 获取背景图URL
   */
  getBackdropUrl(path) {
    return this.getFullUrl(path, 'w1280');
  }

  /**
   * 获取头像URL
   */
  getProfileUrl(path) {
    return this.getFullUrl(path, 'w185');
  }
}

// 单例模式
const imageHelper = new ImageHelper();

module.exports = imageHelper;
