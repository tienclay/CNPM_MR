const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tailieu', {
    Ten: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    },
    ID_LuotIn: {
      type: DataTypes.STRING(16),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'luotin',
        key: 'ID'
      }
    },
    SoTrang: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    SoBan: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    LoaiGiay: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    QRCode: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    FilePath: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    SttHangDoi: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    HuongIn: {
      type: DataTypes.STRING(50),
      allowNull: true
    },
    KieuIn: {
      type: DataTypes.STRING(50),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'tailieu',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "Ten" },
          { name: "ID_LuotIn" },
        ]
      },
      {
        name: "ID_LuotIn",
        using: "BTREE",
        fields: [
          { name: "ID_LuotIn" },
        ]
      },
    ]
  });
};
