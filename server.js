// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');
const request = require('superagent');
// Application Setup
// - make an express app!
const app = express();
// - get the port on which to run the server
const PORT = process.env.PORT || 3000;
// - enable CORS
app.use(cors());
let lat = '';
let lon = '';

app.get('/location', (req, res) => {

    getLocation(req.query.search).then((locationObject => {
        const response = formatObject(locationObject);
        lat = response.latitude;
        lon = response.longitude;
        res.json(response);
    }));

});

app.get('/weather', (req, res) => {
    const weatherResponse = getWeather();
    const parseWeather = formatWeatherObject(weatherResponse);
    res.json(parseWeather);
});

app.listen(PORT, () => console.log('listening on 3001'));

// gets the object
const getLocation = async(citySearched) => {
    const geoData = await request.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${citySearched}&format=json`);
    return JSON.parse(geoData.text)[0];
};

const getWeather = async(lat, lon) => {
    const weatherData = await request.get(`https://api.weatherbit.io/v2.0/current?&lat=${lat}&lon=${lon}&key=${process.env.WEATHERBIT_API_KEY}`);
    return JSON.parse(weatherData.data)
};

// formats the object
function formatObject(firstObject) {
    return {
        formatted_query: firstObject.display_name,
        latitude: firstObject.lat,
        longitude: firstObject.lon,
    };
}


function getLatLon(firstObject) {
    try {
        const latLonObject = {
            latitude: firstObject.lat,
            longitude: firstObject.lon,
        };
        return latLonObject;
    }
    catch(err) {
        throw new Error();
    }
}

function formatWeatherObject(weatherArray) {
    return weatherArray.map(weatherObject => {
        return {
            forecast: weatherObject.weather.description,
            time: weatherObject.datetime
        };
    });
}