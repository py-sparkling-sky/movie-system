'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('movies', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '电影ID'
      },
      title: {
        type: Sequelize.STRING(100),
        allowNull: false,
        comment: '标题'
      },
      poster: {
        type: Sequelize.STRING(255),
        allowNull: false,
        comment: '海报URL'
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false,
        comment: '简介'
      },
      director: {
        type: Sequelize.STRING(50),
        comment: '导演'
      },
      release_date: {
        type: Sequelize.DATE,
        comment: '上映日期'
      },
      duration: {
        type: Sequelize.INTEGER,
        comment: '时长（分钟）'
      },
      rating: {
        type: Sequelize.DECIMAL(2, 1),
        defaultValue: 0.0,
        comment: '平均评分'
      },
      rating_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: '评分人数'
      },
      view_count: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
        comment: '观看次数'
      },
      status: {
        type: Sequelize.TINYINT,
        defaultValue: 1,
        comment: '状态：1-上架，0-下架'
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
    await queryInterface.addIndex('movies', ['status'], { name: 'idx_status' });
    await queryInterface.addIndex('movies', ['rating'], { name: 'idx_rating' });
    await queryInterface.addIndex('movies', ['view_count'], { name: 'idx_view_count' });
    await queryInterface.addIndex('movies', ['created_at'], { name: 'idx_created_at' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('movies');
  }
};
