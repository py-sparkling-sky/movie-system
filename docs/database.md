# 数据库设计文档

## 1. 数据库概述

- **数据库类型**: MySQL 8.0
- **字符集**: utf8mb4
- **排序规则**: utf8mb4_unicode_ci
- **ORM框架**: Sequelize 6.37.8

## 2. 数据表设计

### 2.1 users表（用户表）

**表名**: `users`

**说明**: 存储用户基本信息和认证信息

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 用户ID |
| username | VARCHAR(20) | NOT NULL, UNIQUE | 用户名 |
| email | VARCHAR(50) | NOT NULL, UNIQUE | 邮箱 |
| password | VARCHAR(255) | NOT NULL | 密码（Bcrypt加密） |
| nickname | VARCHAR(30) | NULL | 昵称 |
| avatar | VARCHAR(255) | NULL | 头像URL |
| role | TINYINT | DEFAULT 0 | 角色（0-普通用户，1-管理员） |
| status | TINYINT | DEFAULT 1 | 状态（1-正常，0-禁用） |
| last_login_at | DATETIME | NULL | 最后登录时间 |
| created_at | DATETIME | NOT NULL | 创建时间 |
| updated_at | DATETIME | NOT NULL | 更新时间 |

**索引**:
- `idx_username`: username唯一索引
- `idx_email`: email唯一索引
- `idx_status`: status普通索引

**关联关系**:
- 与movies表：多对多（通过favorites表）
- 与watch_records表：一对多

---

### 2.2 movies表（电影表）

**表名**: `movies`

**说明**: 存储电影基本信息

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 电影ID |
| title | VARCHAR(100) | NOT NULL | 标题 |
| poster | VARCHAR(255) | NOT NULL | 海报URL |
| description | TEXT | NOT NULL | 简介 |
| director | VARCHAR(50) | NULL | 导演 |
| release_date | DATE | NULL | 上映日期 |
| duration | INT | NULL | 时长（分钟） |
| rating | DECIMAL(2,1) | DEFAULT 0.0 | 平均评分 |
| rating_count | INT | DEFAULT 0 | 评分人数 |
| view_count | INT | DEFAULT 0 | 观看次数 |
| status | TINYINT | DEFAULT 1 | 状态（1-上架，0-下架） |
| created_at | DATETIME | NOT NULL | 创建时间 |
| updated_at | DATETIME | NOT NULL | 更新时间 |

**索引**:
- `idx_status`: status普通索引
- `idx_rating`: rating普通索引
- `idx_view_count`: view_count普通索引
- `idx_created_at`: created_at普通索引

**关联关系**:
- 与genres表：多对多（通过movie_genres表）
- 与users表：多对多（通过favorites表）
- 与watch_records表：一对多

---

### 2.3 genres表（分类表）

**表名**: `genres`

**说明**: 存储电影分类信息

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 分类ID |
| name | VARCHAR(20) | NOT NULL, UNIQUE | 分类名称 |
| created_at | DATETIME | NOT NULL | 创建时间 |

**索引**:
- `idx_name`: name唯一索引

**关联关系**:
- 与movies表：多对多（通过movie_genres表）

**预置数据**:
- 动作、喜剧、剧情、科幻、恐怖、爱情、动画、悬疑、惊悚、纪录片、战争、犯罪、奇幻、冒险、历史、音乐、歌舞、家庭、传记、体育

---

### 2.4 movie_genres表（电影分类关联表）

**表名**: `movie_genres`

**说明**: 电影与分类的多对多关联表

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| movie_id | INT | NOT NULL | 电影ID |
| genre_id | INT | NOT NULL | 分类ID |
| created_at | DATETIME | NOT NULL | 创建时间 |

**约束**:
- PRIMARY KEY: (movie_id, genre_id)

**索引**:
- `idx_movie_id`: movie_id普通索引
- `idx_genre_id`: genre_id普通索引

---

### 2.5 favorites表（收藏表）

**表名**: `favorites`

**说明**: 存储用户收藏的电影

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 收藏ID |
| user_id | INT | NOT NULL | 用户ID |
| movie_id | INT | NOT NULL | 电影ID |
| created_at | DATETIME | NOT NULL | 收藏时间 |

**索引**:
- `idx_user_movie_unique`: (user_id, movie_id)唯一索引
- `idx_user_id`: user_id普通索引
- `idx_movie_id`: movie_id普通索引

**约束**:
- 一个用户只能收藏一次同一部电影

---

### 2.6 watch_records表（观影记录表）

**表名**: `watch_records`

**说明**: 存储用户的观影记录

| 字段名 | 类型 | 约束 | 说明 |
|--------|------|------|------|
| id | INT | PRIMARY KEY, AUTO_INCREMENT | 记录ID |
| user_id | INT | NOT NULL | 用户ID |
| movie_id | INT | NOT NULL | 电影ID |
| progress | INT | DEFAULT 0 | 观看进度（0-100） |
| duration | INT | DEFAULT 0 | 观看时长（秒） |
| last_watched_at | DATETIME | NULL | 最后观看时间 |
| created_at | DATETIME | NOT NULL | 创建时间 |
| updated_at | DATETIME | NOT NULL | 更新时间 |

**索引**:
- `idx_user_movie_unique`: (user_id, movie_id)唯一索引
- `idx_user_id`: user_id普通索引
- `idx_movie_id`: movie_id普通索引
- `idx_last_watched_at`: last_watched_at普通索引

**约束**:
- 一个用户对一部电影只有一条记录

---

## 3. E-R图

```
┌─────────────┐
│   users     │
│  (用户表)   │
└─────────────┘
       │
       │ 1
       │
       ├──────────────────────┐
       │                      │
       │ N                    │ N
       │                      │
┌─────────────┐        ┌─────────────┐
│  favorites  │        │watch_records│
│  (收藏表)   │        │ (观影记录)  │
└─────────────┘        └─────────────┘
       │                      │
       │ N                    │ N
       │                      │
       └──────────┬───────────┘
                  │
                  │ 1
                  │
           ┌─────────────┐
           │   movies    │
           │  (电影表)   │
           └─────────────┘
                  │
                  │ N
                  │
           ┌─────────────┐
           │movie_genres │
           │ (关联表)    │
           └─────────────┘
                  │
                  │ N
                  │
           ┌─────────────┐
           │   genres    │
           │  (分类表)   │
           └─────────────┘
```

## 4. 数据库迁移

### 4.1 迁移文件

迁移文件位于 `database/migrations/` 目录，按时间戳命名：

1. `20240101000001-create-users.js` - 创建users表
2. `20240101000002-create-genres.js` - 创建genres表
3. `20240101000003-create-movies.js` - 创建movies表
4. `20240101000004-create-movie-genres.js` - 创建movie_genres表
5. `20240101000005-create-favorites.js` - 创建favorites表
6. `20240101000006-create-watch-records.js` - 创建watch_records表

### 4.2 执行迁移

```bash
# 方式1：使用Sequelize CLI
npx sequelize-cli db:migrate

# 方式2：使用Node.js脚本
node scripts/migrate.js
```

### 4.3 回滚迁移

```bash
npx sequelize-cli db:migrate:undo:all
```

---

## 5. 种子数据

### 5.1 种子文件

种子文件位于 `database/seeders/` 目录：

1. `20240101000001-demo-genres.js` - 插入电影分类数据
2. `20240101000002-demo-admin.js` - 创建管理员账号

### 5.2 执行种子

```bash
# 方式1：使用Sequelize CLI
npx sequelize-cli db:seed:all

# 方式2：使用Node.js脚本
node scripts/seed.js
```

---

## 6. 查询优化建议

### 6.1 索引使用

- WHERE条件字段应建立索引
- JOIN关联字段应建立索引
- ORDER BY排序字段可考虑建立索引
- 避免在索引列上使用函数

### 6.2 查询优化

- 使用分页查询，避免一次性查询大量数据
- 使用Sequelize的include进行关联查询，避免N+1问题
- 合理使用eager loading和lazy loading
- 复杂查询考虑使用原生SQL

### 6.3 示例查询

#### 获取电影列表（带分类）
```javascript
const movies = await Movie.findAll({
  include: [{
    model: Genre,
    as: 'genres',
    through: { attributes: [] }
  }],
  where: { status: 1 },
  order: [['created_at', 'DESC']],
  limit: 20,
  offset: 0
});
```

#### 获取用户收藏（带电影信息）
```javascript
const favorites = await Favorite.findAll({
  where: { user_id: userId },
  include: [{
    model: Movie,
    as: 'Movie'
  }],
  order: [['created_at', 'DESC']]
});
```

---

## 7. 数据备份与恢复

### 7.1 备份

```bash
# 使用mysqldump
mysqldump -u root -p movie_watching_system > backup.sql

# 备份特定表
mysqldump -u root -p movie_watching_system users movies > backup.sql
```

### 7.2 恢复

```bash
mysql -u root -p movie_watching_system < backup.sql
```

---

## 8. 数据库配置

### 8.1 连接配置

```javascript
{
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 3306,
  database: process.env.DB_NAME || 'movie_watching_system',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD,
  dialect: 'mysql',
  timezone: '+08:00',
  logging: false
}
```

### 8.2 连接池配置

```javascript
{
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
}
```
