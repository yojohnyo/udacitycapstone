import {getWeather} from "../src/client/js/app";

const dotenv = require('dotenv');
dotenv.config();
const weatherAPIKey = {'weatherbitkey': process.env.WEATHERBITKEY};

const url = 'https://api.weatherbit.io/v2.0/current?';
const cityData = {'lng': '-87.65005', 'lat': '41.85003'};

test("Get Current Weather for Chicago", async (done) => {
    document.body.innerHTML = `
        <div class="holder start-date">
            <label for="start-date">Enter the start date of your trip</label>
            <input type="date" id="start-date" placeholder="Enter the start date">
        </div>`

    document.getElementById('start-date').value = '2020-08-08'
    const response = await getWeather(url, cityData, weatherAPIKey, 15)
    expect(response.weatherInfo.temp).toBeGreaterThan(-20)
    expect(response.weatherInfo.temp).toBeLessThan(110)
    done();
});
