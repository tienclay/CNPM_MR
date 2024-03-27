const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tinnhan', {
    STT: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1
    },
    ID: {
      type: DataTypes.STRING(16),
      allowNull: false,
      primaryKey: true
    },
    NoiDung: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    TieuDe: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Loai: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ThoiGian: {
      type: DataTypes.DATE,
      allowNull: false
    },
    ID_NguoiDung: {
      type: DataTypes.STRING(16),
      allowNull: true,
      references: {
        model: 'nguoidung',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'tinnhan',
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
        name: "ID_NguoiDung",
        using: "BTREE",
        fields: [
          { name: "ID_NguoiDung" },
        ]
      },
    ]
  });
};
