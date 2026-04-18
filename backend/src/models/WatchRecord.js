'use strict';
module.exports = (sequelize, DataTypes) => {
  const WatchRecord = sequelize.define('WatchRecord', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '记录ID'
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      comment: '用户ID'
    },
    movieId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'movie_id',
      comment: '电影ID'
    },
    progress: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '观看进度（0-100）'
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      comment: '观看时长（秒）'
    },
    lastWatchedAt: {
      type: DataTypes.DATE,
      field: 'last_watched_at',
      comment: '最后观看时间'
    }
  }, {
    tableName: 'watch_records',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: false,
    indexes: [
      { unique: true, fields: ['user_id', 'movie_id'] },
      { fields: ['user_id'] },
      { fields: ['movie_id'] },
      { fields: ['last_watched_at'] }
    ]
  });

  WatchRecord.associate = function(models) {
    WatchRecord.belongsTo(models.User, {
      foreignKey: 'user_id',
      as: 'user'
    });
    WatchRecord.belongsTo(models.Movie, {
      foreignKey: 'movie_id',
      as: 'movie'
    });
  };

  return WatchRecord;
};
