'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('favorites', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '收藏ID'
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
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 创建唯一索引（一个用户只能收藏一次）
    await queryInterface.addIndex('favorites', ['user_id', 'movie_id'], {
      unique: true,
      name: 'idx_user_movie_unique'
    });

    // 创建普通索引
    await queryInterface.addIndex('favorites', ['user_id'], { name: 'idx_user_id' });
    await queryInterface.addIndex('favorites', ['movie_id'], { name: 'idx_movie_id' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('favorites');
  }
};
