'use strict';
module.exports = (sequelize, DataTypes) => {
  const MovieGenre = sequelize.define('MovieGenre', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'movie_id',
      comment: '电影ID'
    },
    genreId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'genre_id',
      comment: '分类ID'
    }
  }, {
    tableName: 'movie_genres',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { unique: true, fields: ['movie_id', 'genre_id'] },
      { fields: ['movie_id'] },
      { fields: ['genre_id'] }
    ]
  });

  return MovieGenre;
};
