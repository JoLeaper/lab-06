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
        console.log(req.query.search);
        const response = formatObject(locationObject);
        console.log(response);
        lat = response.latitude;
        lon = response.longitude;
        res.json(response);
    }));

});

app.get('/weather', (req, res) => {
    const object = formatWeatherObject();
    res.json(object);
    
});

app.listen(PORT, () => console.log('listening on 3001'));

// gets the object
const getLocation = async(citySearched) => {
    const geoData = await request.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${citySearched}&format=json`);
    return JSON.parse(geoData.text)[0];
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

function formatWeatherObject() {
    const weatherArray = weatherData.data;
    try {
        const formattedObjectArray = weatherArray.map(weatherObject => {
            return {
                forecast: weatherObject.weather.description,
                time: weatherObject.datetime
            };
        });
        return formattedObjectArray;
    
    }
    catch(err) {
        throw new Error();
    }


}