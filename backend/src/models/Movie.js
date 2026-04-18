'use strict';
module.exports = (sequelize, DataTypes) => {
  const Movie = sequelize.define('Movie', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '电影ID'
    },
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
      comment: '标题'
    },
    poster: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '海报URL'
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      comment: '简介'
    },
    director: {
      type: DataTypes.STRING(50),
      comment: '导演'
    },
    releaseDate: {
      type: DataTypes.DATE,
      field: 'release_date',
      comment: '上映日期'
    },
    duration: {
      type: DataTypes.INTEGER,
      comment: '时长（分钟）'
    },
    rating: {
      type: DataTypes.DECIMAL(2, 1),
      defaultValue: 0.0,
      comment: '平均评分'
    },
    ratingCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'rating_count',
      comment: '评分人数'
    },
    viewCount: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      field: 'view_count',
      comment: '观看次数'
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '状态：1-上架，0-下架'
    }
  }, {
    tableName: 'movies',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { fields: ['status'] },
      { fields: ['rating'] },
      { fields: ['view_count'] },
      { fields: ['created_at'] }
    ]
  });

  Movie.associate = function(models) {
    Movie.belongsToMany(models.Genre, {
      through: 'MovieGenre',
      foreignKey: 'movie_id',
      otherKey: 'genre_id',
      as: 'genres'
    });
    Movie.belongsToMany(models.User, {
      through: models.Favorite,
      foreignKey: 'movie_id',
      otherKey: 'user_id',
      as: 'favoritedUsers'
    });
    Movie.hasMany(models.WatchRecord, {
      foreignKey: 'movie_id',
      as: 'watchRecords'
    });
  };

  return Movie;
};
