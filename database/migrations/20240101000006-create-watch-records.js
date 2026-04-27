'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('watch_records', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '记录ID'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '用户ID'
      },
      movie_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '电影ID'
      },
      progress: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: '观看进度（0-100）'
      },
      duration: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: '观看时长（秒）'
      },
      last_watched_at: {
        type: Sequelize.DATE,
        comment: '最后观看时间'
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

    // 创建唯一索引（一个用户对一部电影只有一条记录）
    await queryInterface.addIndex('watch_records', ['user_id', 'movie_id'], {
      unique: true,
      name: 'idx_user_movie_unique'
    });

    // 创建普通索引
    await queryInterface.addIndex('watch_records', ['user_id'], { name: 'idx_user_id' });
    await queryInterface.addIndex('watch_records', ['movie_id'], { name: 'idx_movie_id' });
    await queryInterface.addIndex('watch_records', ['last_watched_at'], { name: 'idx_last_watched_at' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('watch_records');
  }
};
