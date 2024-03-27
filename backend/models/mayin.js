const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mayin', {
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
    Hang: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Model: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    KhayGiay: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    LoaiMuc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ViTri: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TinhTrang: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    InMau: {
      type: DataTypes.BOOLEAN,
      allowNull: true
    },
    CongSuat: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TrongLuong: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    DoPhanGiai: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    Kieu: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    TocDoIn: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    KichThuoc: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    BoNho: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    AnhMayIn: {
      type: DataTypes.STRING(255),
      allowNull: true
    }
  }, {
    sequelize,
    tableName: 'mayin',
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
    ]
  });
};
