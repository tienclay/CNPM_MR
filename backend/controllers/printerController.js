const { mayin, tailieu, luotin } = require("../models");

const getTotalPrinter = async (req, res) => {
  try {
    const count = await mayin.count();
    res.json(count);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTotalPage = async (req, res) => {
  try {
    const count = await tailieu.count();
    res.json(count);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTotalPrints = async (req, res) => {
  try {
    const count = await luotin.count();
    res.json(count);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addPrinter = async (req, res) => {
  try {
    const printer = await mayin.create(req.body);
    res.json({ message: "Printer added successfully", ID: printer.ID });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrinterDetails = async (req, res) => {
  try {
    const printers = await mayin.findAll({
      attributes: ["Model", "ID", "ViTri", "TinhTrang"],
    });
    res.json(printers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPrinterByID = async (req, res) => {
  try {
    const { id } = req.params;
    const printer = await mayin.findByPk(id);
    if (!printer) {
      return res.status(404).json({ message: "Printer not found" });
    }
    res.json(printer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePrinterStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const printer = await mayin.findByPk(id);
    if (!printer) {
      return res.status(404).json({ message: "Printer not found" });
    }
    printer.TinhTrang = printer.TinhTrang == "Working" ? "Disabled" : "Working";
    await printer.save();
    res.json({
      message: "Printer saved successfully",
      ID: printer.ID,
      TinhTrang: printer.TinhTrang,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updatePrinterDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const printer = await mayin.findByPk(id);
    if (!printer) {
      return res.status(404).json({ message: "Printer not found" });
    }
    printer.KhayGiay = req.body.KhayGiay;
    printer.LoaiMuc = req.body.LoaiMuc;
    printer.ViTri = req.body.ViTri;
    printer.TinhTrang = req.body.TinhTrang;
    printer.InMau = req.body.InMau;
    printer.CongSuat = req.body.CongSuat;
    printer.TrongLuong = req.body.TrongLuong;
    printer.Kieu = req.body.Kieu;
    printer.TocDoIn = req.body.TocDoIn;
    printer.KichThuoc = req.body.KichThuoc;
    printer.BoNho = req.body.BoNho;
    printer.AnhMayIn = req.body.AnhMayIn;
    printer.DoPhanGiai = req.body.DoPhanGiai;
    await printer.save();
    res.json({ message: "Printer saved successfully", ID: printer.ID });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePrinter = async (req, res) => {
  try {
    const { id } = req.params;
    const printer = await mayin.findByPk(id);
    if (!printer) {
      return res.status(404).json({ message: "Printer not found" });
    }
    await printer.destroy();
    res.json({ message: "Printer deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getTotalPage,
  getTotalPrinter,
  getTotalPrints,
  addPrinter,
  getPrinterDetails,
  getPrinterByID,
  updatePrinterStatus,
  updatePrinterDetails,
  deletePrinter,
};
