import {getCity} from "../src/client/js/app";

const baseURL = 'http://api.geonames.org/searchJSON?county=us&q=';
const apiKey = '&username=yojohnyo';
const city = 'chicago'

test("Get latitude / longitude for Chicago", async (done) => {
    const response = await getCity(baseURL, apiKey, city);
    expect(response.geonames[0].lat).toBe("41.85003")
    expect(response.geonames[0].lng).toBe("-87.65005")
    done();
});