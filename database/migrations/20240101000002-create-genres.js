'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('genres', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        comment: '分类ID'
      },
      name: {
        type: Sequelize.STRING(20),
        allowNull: false,
        unique: true,
        comment: '分类名称'
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // 创建索引
    await queryInterface.addIndex('genres', ['name'], { unique: true, name: 'idx_name' });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('genres');
  }
};
