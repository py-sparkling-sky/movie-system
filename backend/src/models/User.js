'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: '用户ID'
    },
    username: {
      type: DataTypes.STRING(20),
      allowNull: false,
      unique: true,
      comment: '用户名'
    },
    email: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true,
      comment: '邮箱'
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
      comment: '密码（加密）'
    },
    nickname: {
      type: DataTypes.STRING(30),
      comment: '昵称'
    },
    avatar: {
      type: DataTypes.STRING(255),
      comment: '头像URL'
    },
    role: {
      type: DataTypes.TINYINT,
      defaultValue: 0,
      comment: '角色：0-普通用户，1-管理员'
    },
    status: {
      type: DataTypes.TINYINT,
      defaultValue: 1,
      comment: '状态：1-正常，0-禁用'
    },
    lastLoginAt: {
      type: DataTypes.DATE,
      field: 'last_login_at',
      comment: '最后登录时间'
    }
  }, {
    tableName: 'users',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
    indexes: [
      { unique: true, fields: ['username'] },
      { unique: true, fields: ['email'] },
      { fields: ['status'] }
    ]
  });

  User.associate = function(models) {
    User.belongsToMany(models.Movie, {
      through: models.Favorite,
      foreignKey: 'user_id',
      otherKey: 'movie_id',
      as: 'favorites'
    });
    User.hasMany(models.WatchRecord, {
      foreignKey: 'user_id',
      as: 'watchRecords'
    });
  };

  return User;
};
