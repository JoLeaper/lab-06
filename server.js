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

app.get('/location', async(req, res) => {
    try {
        const searchedLocation = getLocation(res);
        res.json(searchedLocation);
    }
    catch(err) {
        res.status(500).send('Sorry something went wrong');
    }
});
app.get('/weather', (req, res) => {
    const object = formatWeatherObject();
    res.json(object);
    
});

app.listen(PORT, () => console.log('listening on 3001'));

// gets the object
const getLocation = async(res) => {
    const geoData = await request.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${res}&format=json`);
    const parsedData = JSON.parse(geoData.body)[0];
    return parsedData;
};

// formats the object
function formatObject(firstObject) {
    try {
        const firstFormattedObject = {
            formatted_query: firstObject.display_name,
            latitude: firstObject.lat,
            longitude: firstObject.lon,
        };
        return firstFormattedObject;
    }
    catch(err) {
        throw new Error();
    }
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