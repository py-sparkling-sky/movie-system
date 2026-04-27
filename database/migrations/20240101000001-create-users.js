'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '用户ID'
      },
      username: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        comment: '用户名'
      },
      email: {
        type: Sequelize.STRING(50),
        allowNull: false,
        unique: true,
        comment: '邮箱'
      },
      password: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '密码（加密）'
      },
      nickname: {
        type: Sequelize.STRING(30),
        comment: '昵称'
      },
      avatar: {
        type: Sequelize.STRING(255),
        comment: '头像URL'
      },
      role: {
        type: Sequelize.TINYINT,
        defaultValue: 0,
        comment: '角色：0-普通用户，1-管理员'
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 1,
        comment: '状态：1-正常，0-禁用'
      },
      last_login_at: {
        type: Sequelize.DATE,
        comment: '最后登录时间'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // 创建索引
    await queryInterface.addIndex('users', ['username'], { unique: true, name: 'idx_username' });
    await queryInterface.addIndex('users', ['email'], { unique: true, name: 'idx_email' });
    await queryInterface.addIndex('users', ['status'], { name: 'idx_status' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('users');
  }
};
