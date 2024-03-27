const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quanlytinnhan', {
    ID_TinNhan: {
      type: DataTypes.STRING(16),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'tinnhan',
        key: 'ID'
      }
    },
    ID_QuanTriVien: {
      type: DataTypes.STRING(16),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'quantrivien',
        key: 'ID'
      }
    }
  }, {
    sequelize,
    tableName: 'quanlytinnhan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_TinNhan" },
          { name: "ID_QuanTriVien" },
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
