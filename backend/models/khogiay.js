const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('khogiay', {
    MayIn: {
      type: DataTypes.STRING(16),
      allowNull: false,
      primaryKey: true,
      references: {
        model: 'mayin',
        key: 'ID'
      }
    },
    KhoGiay: {
      type: DataTypes.STRING(255),
      allowNull: false,
      primaryKey: true
    }
  }, {
    sequelize,
    tableName: 'khogiay',
    timestamps: false,
    indexes: [
      {
        name: "PRIMARY",
        unique: true,
        using: "BTREE",
        fields: [
          { name: "MayIn" },
          { name: "KhoGiay" },
        ]
      },
    ]
  });
};
