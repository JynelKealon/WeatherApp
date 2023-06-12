const express = require("express");
const app = express();
const bodyParser = require("body-parser");

// Configure the Express app to handle form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve the main index.html file for the root route
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/index.html");
});

// Display and use the existing files like HTML, CSS, and JavaScript that are stored in the "WeatherApp" folder as they are without changing them.
app.use(express.static("WeatherApp"));

// Serve the index.html file within the "WeatherApp" folder
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/WeatherApp/index.html");
});

// Handle POST request to the root route
app.post("/", function (req, res) {
  const input = req.body.cityName;
  const isNumericInput = !isNaN(input); // Check if the input is numeric
  let lat;
  let lon;

  if (isNumericInput) {
    // Use zip code API if the input is numeric
    const dataUrl = `https://api.openweathermap.org/geo/1.0/zip?zip=${input},US&appid=511d8dc691c3f462fc7290f379695d0c`;
   // Send a request to get latitude and longitude data for a location, and then use the received data to fetch weather information for that location.
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
    // Send a request to get latitude and longitude data for a location (using city name), and then use the received data to fetch weather information for that location.
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

// Function to fetch weather data and send it as a response
function fetchWeatherData(res, lat, lon, cityName) {
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=511d8dc691c3f462fc7290f379695d0c&units=imperial`;
  https.get(url, function (response) {
    response.on("data", function (data) {
      const jsonData = JSON.parse(data);
      const temp = jsonData.main.temp;
      const des = jsonData.weather[0].description;
      const icon = jsonData.weather[0].icon;
      const imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

      // Send the weather information as a response
      res.write(`<h1>The temperature in ${cityName} is ${temp} degrees</h1>`);
      res.write(`<p>The weather description is ${des} </p>`);
      res.write(`<img src="${imageUrl}">`);
      res.send();
    });
  });
}

// Start the server and listen on port 9000
app.listen(9000);
