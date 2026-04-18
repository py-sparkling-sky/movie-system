/**
 * API调用封装
 */

const API_BASE_URL = 'http://localhost:3000/api';

/**
 * HTTP请求封装
 */
async function request(url, options = {}) {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };
  
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  
  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers
    });
    
    const data = await response.json();
    
    if (data.code === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = 'login.html';
    }
    
    return data;
  } catch (error) {
    console.error('API请求失败:', error);
    return { code: 500, message: '网络错误', data: null };
  }
}

/**
 * 电影相关API
 */
const movieAPI = {
  // 获取电影列表
  getList: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/movies?${query}`);
  },
  
  // 获取电影详情
  getDetail: (id) => request(`/movies/${id}`),
  
  // 获取热门电影
  getHot: (limit = 10) => request(`/movies/hot?limit=${limit}`)
};

/**
 * 用户相关API
 */
const userAPI = {
  // 注册
  register: (data) => request('/users/register', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // 登录
  login: (data) => request('/users/login', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // 获取用户信息
  getProfile: () => request('/users/profile'),
  
  // 更新用户信息
  updateProfile: (data) => request('/users/profile', {
    method: 'PUT',
    body: JSON.stringify(data)
  })
};

/**
 * 观影相关API
 */
const watchAPI = {
  // 添加收藏
  addFavorite: (movieId) => request('/watch/favorites', {
    method: 'POST',
    body: JSON.stringify({ movieId })
  }),
  
  // 取消收藏
  removeFavorite: (movieId) => request(`/watch/favorites/${movieId}`, {
    method: 'DELETE'
  }),
  
  // 获取收藏列表
  getFavorites: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/watch/favorites?${query}`);
  },
  
  // 检查是否已收藏
  checkFavorite: (movieId) => request(`/watch/favorites/check/${movieId}`),
  
  // 更新观影记录
  updateRecord: (data) => request('/watch/records', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  
  // 获取观影记录
  getRecords: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/watch/records?${query}`);
  }
};
