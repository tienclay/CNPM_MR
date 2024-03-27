const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('inan', {
    ID_LuotIn: {
      type: DataTypes.STRING(16),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'luotin',
        key: 'ID'
      }
    },
    ID_MayIn: {
      type: DataTypes.STRING(16),
      allowNull: true,
      references: {
        model: 'mayin',
        key: 'ID'
      }
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
    tableName: 'inan',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_LuotIn" },
        ]
      },
      {
        name: "ID_MayIn",
        using: "BTREE",
        fields: [
          { name: "ID_MayIn" },
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
