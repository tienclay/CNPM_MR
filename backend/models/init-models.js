var DataTypes = require("sequelize").DataTypes;
var _inan = require("./inan");
var _khogiay = require("./khogiay");
var _luotin = require("./luotin");
var _luotmuagiay = require("./luotmuagiay");
var _mayin = require("./mayin");
var _nguoidung = require("./nguoidung");
var _quanlymayin = require("./quanlymayin");
var _quanlytinnhan = require("./quanlytinnhan");
var _quantrivien = require("./quantrivien");
var _tailieu = require("./tailieu");
var _tinnhan = require("./tinnhan");

function initModels(sequelize) {
  var inan = _inan(sequelize, DataTypes);
  var khogiay = _khogiay(sequelize, DataTypes);
  var luotin = _luotin(sequelize, DataTypes);
  var luotmuagiay = _luotmuagiay(sequelize, DataTypes);
  var mayin = _mayin(sequelize, DataTypes);
  var nguoidung = _nguoidung(sequelize, DataTypes);
  var quanlymayin = _quanlymayin(sequelize, DataTypes);
  var quanlytinnhan = _quanlytinnhan(sequelize, DataTypes);
  var quantrivien = _quantrivien(sequelize, DataTypes);
  var tailieu = _tailieu(sequelize, DataTypes);
  var tinnhan = _tinnhan(sequelize, DataTypes);

  mayin.belongsToMany(quantrivien, { as: 'ID_QuanTriVien_quantriviens', through: quanlymayin, foreignKey: "ID_MayIn", otherKey: "ID_QuanTriVien" });
  quantrivien.belongsToMany(mayin, { as: 'ID_MayIn_mayins', through: quanlymayin, foreignKey: "ID_QuanTriVien", otherKey: "ID_MayIn" });
  quantrivien.belongsToMany(tinnhan, { as: 'ID_TinNhan_tinnhans', through: quanlytinnhan, foreignKey: "ID_QuanTriVien", otherKey: "ID_TinNhan" });
  tinnhan.belongsToMany(quantrivien, { as: 'ID_QuanTriVien_quantrivien_quanlytinnhans', through: quanlytinnhan, foreignKey: "ID_TinNhan", otherKey: "ID_QuanTriVien" });
  inan.belongsTo(luotin, { as: "ID_LuotIn_luotin", foreignKey: "ID_LuotIn"});
  luotin.hasOne(inan, { as: "inan", foreignKey: "ID_LuotIn"});
  tailieu.belongsTo(luotin, { as: "ID_LuotIn_luotin", foreignKey: "ID_LuotIn"});
  luotin.hasMany(tailieu, { as: "tailieus", foreignKey: "ID_LuotIn"});
  inan.belongsTo(mayin, { as: "ID_MayIn_mayin", foreignKey: "ID_MayIn"});
  mayin.hasMany(inan, { as: "inans", foreignKey: "ID_MayIn"});
  khogiay.belongsTo(mayin, { as: "MayIn_mayin", foreignKey: "MayIn"});
  mayin.hasMany(khogiay, { as: "khogiays", foreignKey: "MayIn"});
  quanlymayin.belongsTo(mayin, { as: "ID_MayIn_mayin", foreignKey: "ID_MayIn"});
  mayin.hasMany(quanlymayin, { as: "quanlymayins", foreignKey: "ID_MayIn"});
  inan.belongsTo(nguoidung, { as: "ID_NguoiDung_nguoidung", foreignKey: "ID_NguoiDung"});
  nguoidung.hasMany(inan, { as: "inans", foreignKey: "ID_NguoiDung"});
  luotmuagiay.belongsTo(nguoidung, { as: "ID_NguoiDung_nguoidung", foreignKey: "ID_NguoiDung"});
  nguoidung.hasMany(luotmuagiay, { as: "luotmuagiays", foreignKey: "ID_NguoiDung"});
  tinnhan.belongsTo(nguoidung, { as: "ID_NguoiDung_nguoidung", foreignKey: "ID_NguoiDung"});
  nguoidung.hasMany(tinnhan, { as: "tinnhans", foreignKey: "ID_NguoiDung"});
  luotin.belongsTo(quantrivien, { as: "ID_QuanTriVien_quantrivien", foreignKey: "ID_QuanTriVien"});
  quantrivien.hasMany(luotin, { as: "luotins", foreignKey: "ID_QuanTriVien"});
  quanlymayin.belongsTo(quantrivien, { as: "ID_QuanTriVien_quantrivien", foreignKey: "ID_QuanTriVien"});
  quantrivien.hasMany(quanlymayin, { as: "quanlymayins", foreignKey: "ID_QuanTriVien"});
  quanlytinnhan.belongsTo(quantrivien, { as: "ID_QuanTriVien_quantrivien", foreignKey: "ID_QuanTriVien"});
  quantrivien.hasMany(quanlytinnhan, { as: "quanlytinnhans", foreignKey: "ID_QuanTriVien"});
  quanlytinnhan.belongsTo(tinnhan, { as: "ID_TinNhan_tinnhan", foreignKey: "ID_TinNhan"});
  tinnhan.hasMany(quanlytinnhan, { as: "quanlytinnhans", foreignKey: "ID_TinNhan"});

  return {
    inan,
    khogiay,
    luotin,
    luotmuagiay,
    mayin,
    nguoidung,
    quanlymayin,
    quanlytinnhan,
    quantrivien,
    tailieu,
    tinnhan,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
