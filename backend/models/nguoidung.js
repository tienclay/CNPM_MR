const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('nguoidung', {
    STT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    ID: {
      type: DataTypes.STRING(16),
      allowNull: false,
      primaryKey: true
    },
    Ten: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    TenDangNhap: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: "TenDangNhap"
    },
    MatKhau: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    SoLuongGiay: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    VaiTro: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    RefreshToken: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'nguoidung',
    hasTrigger: true,
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID" },
        ]
      },
      {
        name: "TenDangNhap",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "TenDangNhap" },
        ]
      },
    ]
  });
};
