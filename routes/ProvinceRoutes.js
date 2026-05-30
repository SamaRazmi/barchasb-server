const express = require("express");
const router = express();

const ProvinceCtrl = require("../controllers/ProvinceCtrl");

router.get("/provinces", ProvinceCtrl.getAllProvinces);
router.get("/cities/:province", ProvinceCtrl.getCitiesByProvince);
router.get("/all-cities", ProvinceCtrl.getAllCities);

module.exports = router;
