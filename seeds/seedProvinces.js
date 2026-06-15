const { connectDB } = require("../db");
const Province = require("../models/Province");
const provincesJSON = require("../data/ostan.json");
const citiesJSON = require("../data/shahr.json");

const mergeCities = () => {
  return provincesJSON.map((prov) => {
    const cities = citiesJSON
      .filter((city) => city.ostan === prov.id)
      .map((city) => city.name);
    return { name: prov.name, cities };
  });
};

const seedProvinces = async () => {
  await connectDB();
  await Province.deleteMany({});
  const data = mergeCities();
  await Province.insertMany(data);
  console.log("Provinces and cities inserted!");
};

module.exports = seedProvinces;
