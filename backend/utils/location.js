const axios = require("axios");

const HttpError = require("../models/http-error");

const API_KEY = process.env.GOOGLE_API_KEY;
//AIzaSyAa8W2k5rBRUgzmpFlox_ukoDEUHZwIS_8

async function getCoordsForAddress(address) {
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError(
      "Could not find location for the specified address.",
      422
    );
    throw error;
  }

  const coordinates = data.results[0].geometry.location;
  let city;
  for (
    let index = 0;
    index < data.results[0].address_components.length;
    index++
  ) {
    const element = data.results[0].address_components[index];
    console.log(element.types);
    if ("administrative_area_level_1" === element.types[0]) {
      city = element.long_name;
    }
  }
  console.log(city);

  return [coordinates, city];
}

module.exports = getCoordsForAddress;
