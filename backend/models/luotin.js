const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('luotin', {
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
    ThoiGian: {
      type: DataTypes.DATE,
      allowNull: false
    },
    TinhTrang: {
      type: DataTypes.STRING(255),
      allowNull: true
    },
    ID_QuanTriVien: {
      type: DataTypes.STRING(16),
      allowNull: true,
      references: {
        model: 'quantrivien',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'luotin',
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
        name: "ID_QuanTriVien",
        using: "BTREE",
        fields: [
          { name: "ID_QuanTriVien" },
        ]
      },
    ]
  });
};
