const Province = require("../models/Province");

exports.getAllProvinces = async (req, res) => {
  try {
    const provinces = await Province.find({});
    res.json(provinces);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getCitiesByProvince = async (req, res) => {
  try {
    const province = await Province.findOne({ name: req.params.province });
    if (!province)
      return res.status(404).json({ message: "Province not found" });
    res.json(province.cities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllCities = async (req, res) => {
  try {
    const provinces = await Province.find({});
    const allCities = provinces.reduce(
      (acc, province) => acc.concat(province.cities),
      []
    );
    const uniqueCities = [...new Set(allCities)];
    res.json(uniqueCities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
