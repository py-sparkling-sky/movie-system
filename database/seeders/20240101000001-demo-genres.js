'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 使用原始SQL插入分类数据，避免依赖Model
    const genres = [
      { name: '动作', created_at: new Date() },
      { name: '喜剧', created_at: new Date() },
      { name: '剧情', created_at: new Date() },
      { name: '科幻', created_at: new Date() },
      { name: '恐怖', created_at: new Date() },
      { name: '爱情', created_at: new Date() },
      { name: '动画', created_at: new Date() },
      { name: '悬疑', created_at: new Date() },
      { name: '惊悚', created_at: new Date() },
      { name: '纪录片', created_at: new Date() },
      { name: '战争', created_at: new Date() },
      { name: '犯罪', created_at: new Date() },
      { name: '奇幻', created_at: new Date() },
      { name: '冒险', created_at: new Date() },
      { name: '历史', created_at: new Date() },
      { name: '音乐', created_at: new Date() },
      { name: '歌舞', created_at: new Date() },
      { name: '家庭', created_at: new Date() },
      { name: '传记', created_at: new Date() },
      { name: '体育', created_at: new Date() }
    ];

    await queryInterface.bulkInsert('genres', genres, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('genres', null, {});
  }
};
