//new
const geoURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid={979b2d5a264a64bb60bca7aad5965a49}`;
https.get(geoUrl, function(response){
    response,on("data", function(data){

    })
})


const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const https = require("https");
app.use(bodyParser.urlencoded({ extended: true }));
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});
app.use(express.static("WeatherApp")); // Serve static files from the "public" folder
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/WeatherApp/index.html");
});
app.post("/", function (req, res) {
  const input = req.body.cityName;
  const isNumericInput = !isNaN(input); // Check if the input contains only numbers
  let lat;
  let lon;
  if (isNumericInput) {
    // Use zip code API
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
    // Use city name API
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
function fetchWeatherData(res, lat, lon, cityName) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=511d8dc691c3f462fc7290f379695d0c&units=imperial`;
  https.get(url, function (response) {
    response.on("data", function (data) {
      const jsonData = JSON.parse(data);
      const temp = jsonData.main.temp;
      const des = jsonData.weather[0].description;
      const icon = jsonData.weather[0].icon;
      const imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;
      res.write(`<h1>The temp in ${cityName} is ${temp} degrees</h1>`);
      res.write(`<p>The weather description is ${des} </p>`);
      res.write(`<img src="${imageUrl}">`);
      res.send();
    });
  });
}
app.listen(9000);
