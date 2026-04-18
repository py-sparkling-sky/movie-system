'use strict';
module.exports = (sequelize, DataTypes) => {
  const Genre = sequelize.define('Genre', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '分类ID'
    },
    name: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: '分类名称'
    }
  }, {
    tableName: 'genres',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false
  });

  Genre.associate = function(models) {
    Genre.belongsToMany(models.Movie, {
      through: 'MovieGenre',
      foreignKey: 'genre_id',
      otherKey: 'movie_id',
      as: 'movies'
    });
  };

  return Genre;
};
