'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('movie_genres', {
      movie_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '电影ID'
      },
      genre_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: '分类ID'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 创建复合主键
    await queryInterface.addConstraint('movie_genres', {
      fields: ['movie_id', 'genre_id'],
      type: 'primary key',
      name: 'pk_movie_genres'
    });

    // 创建索引
    await queryInterface.addIndex('movie_genres', ['movie_id'], { name: 'idx_movie_id' });
    await queryInterface.addIndex('movie_genres', ['genre_id'], { name: 'idx_genre_id' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('movie_genres');
  }
};
