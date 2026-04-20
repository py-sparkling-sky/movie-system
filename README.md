# 观影系统

一个完整的观影管理系统，包含电影浏览、用户管理、收藏功能和观影记录等核心功能。

## 功能特性

- **电影浏览与搜索**：电影列表展示、详情查看、搜索筛选、分类筛选
- **用户管理**：用户注册、登录、个人信息管理
- **观影管理**：电影收藏、观影记录管理
- **后台管理**：电影信息管理、用户管理、数据统计（管理员功能）

## 技术栈

### 前端
- HTML5 + CSS3 + JavaScript (ES6+)
- Bootstrap 5.3.0（UI框架）
- Bootstrap Icons 1.10.3（图标库）

### 后端
- Node.js 18+
- Express.js 5.x（Web框架）
- MySQL 8.0（数据库）
- Sequelize 6.x（ORM框架）
- JWT（身份认证）
- Bcrypt（密码加密）

## 项目结构

```
观影系统/
├── frontend/                 # 前端代码
│   ├── index.html           # 首页
│   ├── login.html           # 登录页
│   ├── register.html        # 注册页
│   ├── js/
│   │   ├── api.js           # API调用封装
│   │   └── utils.js         # 工具函数
│   └── assets/              # 静态资源
│
├── backend/                  # 后端代码
│   ├── src/
│   │   ├── app.js           # 应用入口
│   │   ├── config/          # 配置文件
│   │   ├── models/          # 数据模型
│   │   ├── services/        # 业务服务
│   │   ├── routes/          # 路由
│   │   ├── middlewares/     # 中间件
│   │   └── utils/           # 工具函数
│   ├── package.json         # 依赖配置
│   └── .env                 # 环境变量
│
└── .codeartsdoer/           # SDD文档
    └── specs/
        └── movie_sys/
            ├── spec.md      # 需求规格
            ├── design.md    # 技术设计
            └── tasks.md     # 任务规划
```

## 安装与运行

### 前置要求

- Node.js 18+
- MySQL 8.0
- npm 或 yarn

### 1. 数据库配置

创建MySQL数据库：
```sql
CREATE DATABASE movie_watching_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. 后端配置

```bash
# 进入后端目录
cd backend

# 安装依赖
npm install

# 配置环境变量
# 编辑 .env 文件，修改数据库连接信息
# DB_HOST=localhost
# DB_PORT=3306
# DB_NAME=movie_watching_system
# DB_USER=root
# DB_PASSWORD=your_password

# 启动开发服务器
npm run dev
```

后端服务将在 http://localhost:3000 启动

### 3. 前端访问

直接在浏览器中打开 `frontend/index.html` 文件，或使用任意静态文件服务器托管前端文件。

## 默认账号

系统会自动创建管理员账号：
- 用户名：admin
- 邮箱：admin@example.com
- 密码：admin123456

## API接口

### 电影相关
- `GET /api/movies` - 获取电影列表
- `GET /api/movies/:id` - 获取电影详情
- `GET /api/movies/hot` - 获取热门电影

### 用户相关
- `POST /api/users/register` - 用户注册
- `POST /api/users/login` - 用户登录
- `GET /api/users/profile` - 获取用户信息（需认证）
- `PUT /api/users/profile` - 更新用户信息（需认证）

### 观影相关
- `POST /api/watch/favorites` - 添加收藏（需认证）
- `DELETE /api/watch/favorites/:movieId` - 取消收藏（需认证）
- `GET /api/watch/favorites` - 获取收藏列表（需认证）
- `GET /api/watch/records` - 获取观影记录（需认证）

## 开发说明

### 环境变量

后端 `.env` 文件配置：
```
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=movie_watching_system
DB_USER=root
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
```

### 数据库模型

系统包含以下数据表：
- `movies` - 电影表
- `genres` - 分类表
- `movie_genres` - 电影分类关联表
- `users` - 用户表
- `favorites` - 收藏表
- `watch_records` - 观影记录表

## 部署

### 生产环境部署

1. 使用PM2管理Node.js进程：
```bash
npm install -g pm2
pm2 start backend/src/app.js --name movie-system
```

2. 使用Nginx作为反向代理：
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/frontend;
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
    }
}
```

## 许可证

MIT License

## 联系方式

如有问题，请提交Issue或联系开发团队。

冲突1

冲突！