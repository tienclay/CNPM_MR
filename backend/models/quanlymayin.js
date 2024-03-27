const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('quanlymayin', {
    ID_MayIn: {
      type: DataTypes.STRING(16),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'mayin',
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
    tableName: 'quanlymayin',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "ID_MayIn" },
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
