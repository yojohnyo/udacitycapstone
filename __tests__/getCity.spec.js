import {getCity} from "../src/client/js/app";

const baseURL = 'http://api.geonames.org/searchJSON?county=us&q=';
const apiKey = '&username=yojohnyo';
const city = 'chicago';
const key = '1234';

test("Get latitude / longitude for Chicago", async (done) => {
    const response = await getCity(baseURL, apiKey, city, key);
    expect(response.cityData.geonames[0].lat).toBe("41.85003")
    expect(response.cityData.geonames[0].lng).toBe("-87.65005")
    done();
});