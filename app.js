const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Configure the Express app
app.use(bodyParser.urlencoded({ extended: true }));

// Serve index.html file for the root route
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Serve static files from the "WeatherApp" folder
app.use(express.static("WeatherApp"));

// Serve index.html file for the root route within "WeatherApp" folder
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/WeatherApp/index.html");
});

// Handle POST request to the root route
app.post("/", function (req, res) {
  const input = req.body.cityName;
  const isNumericInput = !isNaN(input); // Check if the input contains only numbers
  let lat;
  let lon;

  if (isNumericInput) {
    // Use zip code API if the input is numeric
    const dataUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${input},US&appid=511d8dc691c3f462fc7290f379695d0c`;
    https.get(dataUrl, function (response) {
      response.on("data", function (data) {
        const jsonData = JSON.parse(data);
        lat = jsonData.lat;
        lon = jsonData.lon;
        fetchWeatherData(res, lat, lon, input);
      });
    });
  } else {
    // Use city name API if the input is a string
    const dataUrl = `https://api.openweathermap.org/geo/1.0/direct?q=${input},US&appid=511d8dc691c3f462fc7290f379695d0c`;
    https.get(dataUrl, function (response) {
      response.on("data", function (data) {
        const jsonData = JSON.parse(data);
        lat = jsonData[0].lat;
        lon = jsonData[0].lon;
        fetchWeatherData(res, lat, lon, input);
      });
    });
  }
});

// Function to fetch weather data
function fetchWeatherData(res, lat, lon, cityName) {
  const url = `https://api.openweathermap.org/data/2.
