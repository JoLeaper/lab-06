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
    try {
        const object = formatObject();
        res.json(object);
    }
    catch(err) {
        res.status(500).send('Sorry something went wrong');
    }
});
app.get('/weather', (req, res) => {
    const object = formatWeatherObject();
    console.log(object);
    res.json(object);
    
});

app.listen(PORT, () => console.log('listening on 3001'));

function formatObject(res) {
    if(res !== 'Portland') {
        throw new Error();
    }
    const firstObject = geoData[0];
    const queryNameArray = firstObject.display_name.split(' ');

    const firstFormattedObject = {
        formatted_query: queryNameArray[0] + ' ' + queryNameArray[3] + ' ' + queryNameArray[4],
        latitude: firstObject.lat,
        longitude: firstObject.lon,
    };
    return firstFormattedObject;
}

function formatWeatherObject() {
    const weatherArray = weatherData.data;

    const formattedObjectArray = weatherArray.map(weatherObject => {
        return {
            forecast: weatherObject.weather.description,
            time: weatherObject.datetime
        };
    });
    return formattedObjectArray;

}