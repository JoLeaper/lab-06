// Load Environment Variables from the .env file
require('dotenv').config();

// Application Dependencies
const express = require('express');
const cors = require('cors');

// Application Setup
// - make an express app!
const app = express();
// - get the port on which to run the server
const PORT = process.env.PORT || 3000;
// - enable CORS
app.use(cors());
const geoData = require('./data/geo.json');
const weatherData = require('./data/weather.json');

app.get('/location', (req, res) => {
    const object = formatObject();
    res.json(object);
});

app.get('/weather', (req, res) => {
    // code that formats weather correctly
    
    // return object that is weather formatted correctly
    res.json();
});

app.listen(PORT, () => console.log('listening on 3001'));

function formatObject() {
    const firstObject = geoData[0];
    const queryNameArray = firstObject.display_name.split(' ');

    const firstFormattedObject = {
        formatted_query: queryNameArray[0] + ' ' + queryNameArray[3] + ' ' + queryNameArray[4],
        latitude: firstObject.lat,
        longitude: firstObject.lon,
    };
    return firstFormattedObject;
}

function formatWeatherObject () {
    const firstObject = geoData[0];
}

    // const locationObject = {
    //     formatted_query: formattedQuery,
    //     latitude: latitude;
    //     longitutde: longitutde;
    // }