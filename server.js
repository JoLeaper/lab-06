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
let lat = '45.5051';
let lon = '-122.6750';

app.get('/location', (req, res) => {

    getLocation(req.query.search).then((locationObject => {
        const response = formatObject(locationObject);
        lat = response.latitude;
        lon = response.longitude;
        res.json(response);
    }));

});

app.get('/weather', (req, res) => {
    getWeather().then((weatherResponse => {
        const parseWeather = formatWeatherObject(weatherResponse.data);
        res.json(parseWeather);
    }));
    
});
app.get('/trails', (req, res) => {
    getTrails().then((trailResponse => {
        const parseTrail = formatTrailObject(trailResponse.trails);
        res.json(parseTrail);
    }));
    
});

// app.get('/yelp', (req, res) => {
//     getYelp().then((yelpResponse => {
//         const parseYelp = formatYelpObject(yelpResponse.data);
//         res.json(parseYelp);
//     }));
    
// });

app.listen(PORT, () => console.log('listening on 3001'));

// gets the object
const getLocation = async(citySearched) => {
    const geoData = await request.get(`https://us1.locationiq.com/v1/search.php?key=${process.env.GEOCODE_API_KEY}&q=${citySearched}&format=json`);
    return JSON.parse(geoData.text)[0];
};

const getWeather = async() => {
    const weatherData = await request.get(`http://api.weatherbit.io/v2.0/forecast/daily?key=${process.env.WEATHERBIT_API_KEY}&lat=${lat}&lon=${lon}`);
    return JSON.parse(weatherData.text);
    
};

const getTrails = async() => {
    const trailData = await request.get(`https://www.hikingproject.com/data/get-trails?lat=${lat}&lon=${lon}&maxDistance=200&key=${process.env.HIKING_API_KEY}`);
    return JSON.parse(trailData.text);
};

// const getYelp = async() => {
//     const yelpData = await request.get(`https://api.yelp.com/v3/search?latitude=${lat}&longitude=${lon}`)
//         .set('Authorization', `Bearer ${process.env.YELP_API_KEY}`
//         );
//     console.log(yelpData.text);
//     return JSON.parse(yelpData.text);
    
// };

// formats the object
function formatObject(firstObject) {
    return {
        formatted_query: firstObject.display_name,
        latitude: firstObject.lat,
        longitude: firstObject.lon,
    };
}

function formatWeatherObject(weatherArray) {
    return weatherArray.map(weatherObject => {
        return {
            forecast: weatherObject.weather.description,
            time: weatherObject.datetime
        };
    });
}

function formatTrailObject(trailArray) {
    return trailArray.map(trailObject => {
        return {
            name: trailObject.name,
            location: trailObject.location,
            length: trailObject.length,
            stars: trailObject.stars,
            star_votes: trailObject.starVotes,
            summary: trailObject.summary,
            trail_url: trailObject.url,
            conditions: trailObject.conditionStatus + ' ' + trailObject.conditionDetails,
            condition_date: trailObject.conditionDate.toString().slice(0, 10),
        };
    });
}
