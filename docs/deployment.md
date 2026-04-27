# 部署文档

## 1. 环境要求

### 1.1 服务器要求

- **操作系统**: Linux (推荐Ubuntu 20.04+) 或 Windows Server
- **CPU**: 2核及以上
- **内存**: 4GB及以上
- **硬盘**: 20GB及以上

### 1.2 软件要求

- **Node.js**: 18.0.0及以上
- **MySQL**: 8.0及以上
- **NPM**: 9.0.0及以上
- **PM2**: 5.0.0及以上（进程管理）
- **Nginx**: 1.18及以上（可选，用于反向代理）

---

## 2. 本地开发环境部署

### 2.1 克隆项目

```bash
git clone <repository-url>
cd 观影系统
```

### 2.2 安装依赖

```bash
# 安装后端依赖
cd backend
npm install

# 安装测试依赖
npm install --save-dev mocha
```

### 2.3 配置环境变量

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑.env文件
# 必须配置：
# - 数据库连接信息
# - TMDB API Key
# - JWT密钥
```

### 2.4 创建数据库

```bash
# 登录MySQL
mysql -u root -p

# 创建数据库
CREATE DATABASE movie_watching_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

# 退出MySQL
exit;
```

### 2.5 执行数据库迁移

```bash
# 方式1：使用Sequelize同步（开发环境）
npm run dev

# 方式2：使用迁移文件（推荐）
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 2.6 启动服务

```bash
# 开发模式（带热重载）
npm run dev

# 生产模式
npm start
```

### 2.7 访问应用

- 前端页面: http://localhost:3000
- API接口: http://localhost:3000/api

---

## 3. 生产环境部署

### 3.1 服务器准备

#### 更新系统
```bash
sudo apt update
sudo apt upgrade -y
```

#### 安装Node.js
```bash
# 安装Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 验证安装
node -v
npm -v
```

#### 安装MySQL
```bash
sudo apt install -y mysql-server

# 启动MySQL
sudo systemctl start mysql
sudo systemctl enable mysql

# 安全配置
sudo mysql_secure_installation
```

#### 安装PM2
```bash
sudo npm install -g pm2
```

#### 安装Nginx（可选）
```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### 3.2 部署应用

#### 上传代码
```bash
# 方式1：使用Git
git clone <repository-url> /var/www/movie-system

# 方式2：使用SCP上传
scp -r ./观影系统 user@server:/var/www/
```

#### 安装依赖
```bash
cd /var/www/movie-system/backend
npm install --production
```

#### 配置环境变量
```bash
# 创建.env文件
nano .env

# 配置生产环境变量
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=movie_watching_system
DB_USER=movie_user
DB_PASSWORD=your_secure_password
JWT_SECRET=your_very_secure_jwt_secret
TMDB_API_KEY=your_tmdb_api_key
```

#### 创建数据库
```bash
mysql -u root -p

CREATE DATABASE movie_watching_system CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'movie_user'@'localhost' IDENTIFIED BY 'your_secure_password';
GRANT ALL PRIVILEGES ON movie_watching_system.* TO 'movie_user'@'localhost';
FLUSH PRIVILEGES;
exit;
```

#### 执行迁移
```bash
npx sequelize-cli db:migrate
npx sequelize-cli db:seed:all
```

### 3.3 使用PM2管理进程

#### 创建PM2配置文件
```bash
nano ecosystem.config.js
```

```javascript
module.exports = {
  apps: [{
    name: 'movie-system',
    script: 'src/app.js',
    instances: 2,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss'
  }]
};
```

#### 启动应用
```bash
# 启动
pm2 start ecosystem.config.js

# 查看状态
pm2 status

# 查看日志
pm2 logs

# 设置开机自启
pm2 startup
pm2 save
```

### 3.4 配置Nginx反向代理

#### 创建Nginx配置
```bash
sudo nano /etc/nginx/sites-available/movie-system
```

```nginx
server {
    listen 80;
    server_name your-domain.com;

    # 日志
    access_log /var/log/nginx/movie-system.access.log;
    error_log /var/log/nginx/movie-system.error.log;

    # 静态文件
    location / {
        root /var/www/movie-system;
        index index.html;
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

#### 启用配置
```bash
# 创建软链接
sudo ln -s /etc/nginx/sites-available/movie-system /etc/nginx/sites-enabled/

# 测试配置
sudo nginx -t

# 重载Nginx
sudo systemctl reload nginx
```

### 3.5 配置HTTPS（可选）

#### 安装Certbot
```bash
sudo apt install -y certbot python3-certbot-nginx
```

#### 获取SSL证书
```bash
sudo certbot --nginx -d your-domain.com
```

#### 自动续期
```bash
sudo certbot renew --dry-run
```

---

## 4. 使用阿里云RDS

### 4.1 创建RDS实例

1. 登录阿里云控制台
2. 创建RDS MySQL实例
3. 配置实例规格和存储空间
4. 设置数据库账号和密码

### 4.2 配置白名单

1. 在RDS实例详情页，找到"数据安全性"
2. 添加应用服务器IP到白名单

### 4.3 获取连接信息

1. 在RDS实例详情页，找到"基本信息"
2. 记录内网地址和端口

### 4.4 修改应用配置

```bash
# 修改.env文件
DB_HOST=rm-xxxxx.mysql.rds.aliyuncs.com
DB_PORT=3306
DB_NAME=movie_watching_system
DB_USER=your_username
DB_PASSWORD=your_password
```

---

## 5. 监控与日志

### 5.1 PM2监控

```bash
# 实时监控
pm2 monit

# 查看进程信息
pm2 show movie-system

# 查看日志
pm2 logs movie-system
```

### 5.2 日志管理

#### 日志文件位置
- PM2日志: `~/.pm2/logs/`
- 应用日志: `./logs/`
- Nginx日志: `/var/log/nginx/`

#### 日志轮转
```bash
# 安装pm2-logrotate
pm2 install pm2-logrotate

# 配置
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### 5.3 性能监控

#### 使用PM2 Plus
```bash
# 连接到PM2 Plus
pm2 link <secret_key> <public_key>
```

---

## 6. 备份策略

### 6.1 数据库备份

#### 手动备份
```bash
mysqldump -u root -p movie_watching_system > backup_$(date +%Y%m%d).sql
```

#### 自动备份脚本
```bash
nano /root/backup.sh
```

```bash
#!/bin/bash
BACKUP_DIR="/root/backups"
DATE=$(date +%Y%m%d_%H%M%S)
FILENAME="movie_system_$DATE.sql"

mkdir -p $BACKUP_DIR
mysqldump -u root -p'your_password' movie_watching_system > $BACKUP_DIR/$FILENAME

# 删除7天前的备份
find $BACKUP_DIR -name "*.sql" -mtime +7 -delete
```

#### 设置定时任务
```bash
crontab -e

# 每天凌晨2点备份
0 2 * * * /root/backup.sh
```

### 6.2 代码备份

```bash
# 使用Git
git add .
git commit -m "Backup $(date +%Y%m%d)"
git push origin main
```

---

## 7. 故障排查

### 7.1 应用无法启动

```bash
# 查看PM2日志
pm2 logs movie-system

# 检查端口占用
netstat -tulpn | grep 3000

# 检查环境变量
pm2 env 0
```

### 7.2 数据库连接失败

```bash
# 测试数据库连接
mysql -h DB_HOST -u DB_USER -p

# 检查数据库服务
sudo systemctl status mysql

# 检查防火墙
sudo ufw status
```

### 7.3 Nginx配置错误

```bash
# 测试Nginx配置
sudo nginx -t

# 查看Nginx错误日志
sudo tail -f /var/log/nginx/error.log
```

---

## 8. 性能优化

### 8.1 Node.js优化

```javascript
// ecosystem.config.js
{
  instances: 'max', // 使用所有CPU核心
  exec_mode: 'cluster'
}
```

### 8.2 MySQL优化

```sql
-- 编辑MySQL配置
sudo nano /etc/mysql/mysql.conf.d/mysqld.cnf

[mysqld]
innodb_buffer_pool_size = 1G
max_connections = 200
query_cache_size = 64M
```

### 8.3 Nginx优化

```nginx
# 启用gzip压缩
gzip on;
gzip_types text/plain text/css application/json application/javascript;

# 启用缓存
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=my_cache:10m;
```

---

## 9. 安全加固

### 9.1 防火墙配置

```bash
# 启用UFW
sudo ufw enable

# 允许必要端口
sudo ufw allow 22    # SSH
sudo ufw allow 80    # HTTP
sudo ufw allow 443   # HTTPS
```

### 9.2 更新系统

```bash
# 定期更新
sudo apt update
sudo apt upgrade -y
```

### 9.3 安全配置

- 修改SSH默认端口
- 禁用root远程登录
- 使用密钥认证
- 定期更换数据库密码
- 定期更换JWT密钥
