import {timeToTrip} from "../src/client/js/app";

test("Test function to determine how long before the trip", ()=> {
    expect(timeToTrip("2020-08-20")).toBeLessThan(32);
})