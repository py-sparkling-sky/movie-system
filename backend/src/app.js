require('dotenv').config();

const express = require('express');
const cors = require('cors');
const db = require('./models');

const movieRoutes = require('./routes/movieRoutes');
const userRoutes = require('./routes/userRoutes');
const watchRoutes = require('./routes/watchRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// 中间件
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 路由
app.use('/api/movies', movieRoutes);
app.use('/api/users', userRoutes);
app.use('/api/watch', watchRoutes);

// 健康检查
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// 404处理
app.use((req, res) => {
  res.status(404).json({
    code: 404,
    message: '接口不存在',
    data: null
  });
});

// 错误处理
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    code: 500,
    message: '服务器内部错误',
    data: null
  });
});

// 数据库同步后启动服务器
db.sequelize.sync({ force: false }).then(async () => {
  console.log('数据库同步成功');
  
  // 初始化分类数据
  const { Genre } = db;
  const genreCount = await Genre.count();
  if (genreCount === 0) {
    const genres = ['动作', '喜剧', '科幻', '剧情', '恐怖', '悬疑', '爱情', '动画', '纪录片', '战争'];
    await Genre.bulkCreate(genres.map(name => ({ name })));
    console.log('分类数据初始化成功');
  }
  
  // 初始化管理员账号
  const { User } = db;
  const bcrypt = require('bcrypt');
  const adminCount = await User.count({ where: { role: 1 } });
  if (adminCount === 0) {
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123456', 10);
    await User.create({
      username: process.env.ADMIN_USERNAME || 'admin',
      email: process.env.ADMIN_EMAIL || 'admin@example.com',
      password: hashedPassword,
      role: 1,
      nickname: '管理员'
    });
    console.log('管理员账号初始化成功');
  }
  
  app.listen(PORT, () => {
    console.log(`服务器运行在端口 ${PORT}`);
    console.log(`访问地址: http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('数据库连接失败:', err);
  process.exit(1);
});

module.exports = app;
