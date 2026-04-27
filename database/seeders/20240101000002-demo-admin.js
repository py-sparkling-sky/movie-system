'use strict';
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 从环境变量获取管理员信息
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123456';

    // 加密密码
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    // 使用原始SQL插入管理员数据
    const admin = {
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      nickname: '系统管理员',
      role: 1, // 管理员
      status: 1, // 正常状态
      created_at: new Date(),
      updated_at: new Date()
    };

    // 检查管理员是否已存在
    const [results] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE username = '${adminUsername}' OR email = '${adminEmail}' LIMIT 1`,
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!results || results.length === 0) {
      await queryInterface.bulkInsert('users', [admin], {});
      console.log('✅ 管理员账号创建成功');
    } else {
      console.log('ℹ️ 管理员账号已存在，跳过创建');
    }
  },

  down: async (queryInterface, Sequelize) => {
    const adminUsername = process.env.ADMIN_USERNAME || 'admin';
    await queryInterface.bulkDelete('users', { username: adminUsername }, {});
  }
};
