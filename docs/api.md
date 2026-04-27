# API接口文档

## 基础信息

- **Base URL**: `http://localhost:3000/api`
- **认证方式**: JWT Bearer Token
- **响应格式**: JSON

## 通用响应格式

```json
{
  "code": 200,
  "message": "success",
  "data": {}
}
```

### 状态码说明

- `200`: 成功
- `400`: 请求参数错误
- `401`: 未授权（未登录或Token失效）
- `403`: 无权限
- `404`: 资源不存在
- `500`: 服务器内部错误

---

## 1. 用户相关接口

### 1.1 用户注册

**接口**: `POST /users/register`

**请求参数**:
```json
{
  "username": "testuser",
  "email": "test@example.com",
  "password": "123456"
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "注册成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "nickname": "testuser",
      "role": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.2 用户登录

**接口**: `POST /users/login`

**请求参数**:
```json
{
  "username": "testuser",
  "password": "123456"
}
```

**说明**: 支持用户名或邮箱登录

**响应示例**:
```json
{
  "code": 200,
  "message": "登录成功",
  "data": {
    "user": {
      "id": 1,
      "username": "testuser",
      "email": "test@example.com",
      "nickname": "testuser",
      "role": 0
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

### 1.3 获取用户信息

**接口**: `GET /users/profile`

**认证**: 需要

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "username": "testuser",
    "email": "test@example.com",
    "nickname": "testuser",
    "avatar": null,
    "role": 0
  }
}
```

### 1.4 更新用户信息

**接口**: `PUT /users/profile`

**认证**: 需要

**请求参数**:
```json
{
  "nickname": "新昵称",
  "avatar": "http://example.com/avatar.jpg"
}
```

---

## 2. 电影相关接口

### 2.1 获取电影列表

**接口**: `GET /movies`

**请求参数**:
- `page`: 页码（默认1）
- `limit`: 每页数量（默认20）
- `genre`: 分类名称（可选）
- `keyword`: 搜索关键词（可选）
- `sort`: 排序方式（created_at, rating, view_count）

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "movies": [
      {
        "id": 1,
        "title": "阿凡达",
        "poster": "https://image.tmdb.org/t/p/w500/abc123.jpg",
        "description": "电影简介...",
        "director": "詹姆斯·卡梅隆",
        "releaseDate": "2009-12-18",
        "duration": 162,
        "rating": 7.5,
        "ratingCount": 10000,
        "viewCount": 5000,
        "Genres": [
          { "id": 1, "name": "动作" },
          { "id": 2, "name": "科幻" }
        ]
      }
    ],
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

### 2.2 获取电影详情

**接口**: `GET /movies/:id`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "id": 1,
    "title": "阿凡达",
    "poster": "https://image.tmdb.org/t/p/w500/abc123.jpg",
    "description": "电影简介...",
    "director": "詹姆斯·卡梅隆",
    "releaseDate": "2009-12-18",
    "duration": 162,
    "rating": 7.5,
    "ratingCount": 10000,
    "viewCount": 5000,
    "Genres": [
      { "id": 1, "name": "动作" },
      { "id": 2, "name": "科幻" }
    ]
  }
}
```

### 2.3 获取热门电影

**接口**: `GET /movies/hot`

**请求参数**:
- `limit`: 数量（默认10）

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": [
    {
      "id": 1,
      "title": "阿凡达",
      "poster": "https://image.tmdb.org/t/p/w500/abc123.jpg",
      "viewCount": 5000
    }
  ]
}
```

---

## 3. 观影相关接口

### 3.1 添加收藏

**接口**: `POST /watch/favorites`

**认证**: 需要

**请求参数**:
```json
{
  "movieId": 1
}
```

**响应示例**:
```json
{
  "code": 200,
  "message": "收藏成功",
  "data": null
}
```

### 3.2 取消收藏

**接口**: `DELETE /watch/favorites/:movieId`

**认证**: 需要

### 3.3 获取收藏列表

**接口**: `GET /watch/favorites`

**认证**: 需要

**请求参数**:
- `page`: 页码（默认1）
- `limit`: 每页数量（默认20）

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "favorites": [
      {
        "id": 1,
        "Movie": {
          "id": 1,
          "title": "阿凡达",
          "poster": "https://image.tmdb.org/t/p/w500/abc123.jpg"
        },
        "created_at": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 10,
    "page": 1,
    "totalPages": 1
  }
}
```

### 3.4 检查是否已收藏

**接口**: `GET /watch/favorites/check/:movieId`

**认证**: 需要

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "isFavorite": true
  }
}
```

### 3.5 更新观影记录

**接口**: `POST /watch/records`

**认证**: 需要

**请求参数**:
```json
{
  "movieId": 1,
  "progress": 50,
  "duration": 3600
}
```

### 3.6 获取观影记录

**接口**: `GET /watch/records`

**认证**: 需要

**请求参数**:
- `page`: 页码（默认1）
- `limit`: 每页数量（默认20）

---

## 4. 管理员接口

### 4.1 获取统计数据

**接口**: `GET /admin/statistics`

**认证**: 需要管理员权限

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "movieCount": 100,
    "userCount": 50,
    "favoriteCount": 200,
    "recordCount": 300,
    "todayNewUsers": 5,
    "topMovies": [
      {
        "id": 1,
        "title": "阿凡达",
        "viewCount": 5000
      }
    ]
  }
}
```

### 4.2 添加电影

**接口**: `POST /admin/movies`

**认证**: 需要管理员权限

**请求参数**:
```json
{
  "title": "新电影",
  "poster": "http://example.com/poster.jpg",
  "description": "电影简介",
  "director": "导演名",
  "releaseDate": "2024-01-01",
  "duration": 120,
  "genreIds": [1, 2]
}
```

### 4.3 更新电影

**接口**: `PUT /admin/movies/:id`

**认证**: 需要管理员权限

### 4.4 删除电影

**接口**: `DELETE /admin/movies/:id`

**认证**: 需要管理员权限

### 4.5 获取用户列表

**接口**: `GET /admin/users`

**认证**: 需要管理员权限

**请求参数**:
- `page`: 页码
- `limit`: 每页数量

### 4.6 更新用户状态

**接口**: `PATCH /admin/users/:id/status`

**认证**: 需要管理员权限

**请求参数**:
```json
{
  "status": 0
}
```

---

## 5. TMDB相关接口

### 5.1 获取TMDB缓存统计

**接口**: `GET /movies/tmdb/stats`

**响应示例**:
```json
{
  "code": 200,
  "message": "success",
  "data": {
    "cache": {
      "enabled": true,
      "size": 50,
      "ttl": 3600
    },
    "rateLimit": {
      "requestsInLastMinute": 10,
      "maxRequestsPerMinute": 40,
      "requestInterval": 250
    }
  }
}
```

---

## 错误响应示例

### 参数错误
```json
{
  "code": 400,
  "message": "参数错误：用户名不能为空",
  "data": null
}
```

### 未授权
```json
{
  "code": 401,
  "message": "未授权，请先登录",
  "data": null
}
```

### 无权限
```json
{
  "code": 403,
  "message": "无权限访问",
  "data": null
}
```

### 资源不存在
```json
{
  "code": 404,
  "message": "电影不存在",
  "data": null
}
```

### 服务器错误
```json
{
  "code": 500,
  "message": "服务器内部错误",
  "data": null
}
```
