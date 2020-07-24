/* Global Variables */
const fetch = require("node-fetch");


const timeToTrip = (tripStartDate) => {
    const tripStart = new Date(tripStartDate);
    const today = new Date();
    return Math.ceil((tripStart.getTime()-today.getTime())/(1000*24*3600));
}

const tripDuration = (tripStartDate, tripEndDate) => {
    const tripStart = new Date(tripStartDate);
    const endDate = new Date(tripEndDate);
    return Math.ceil((tripStart.getTime()-endDate.getTime())/(1000*24*3600));
}

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();


/* Event listener for Generate Click */
document.addEventListener('DOMContentLoaded', (event) => {
    const generateButton = document.getElementById('generate');
    generateButton.addEventListener('click', action);
});


//Get keys from server
const getKeys = async () => {
    const request = await  fetch('/getkeys')
    try{
        const keys = await request.json();
        return keys
    } catch (e) {
        console.log("error".endsWith());

    }
}

/*Event listener for enter key */
document.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        action()
    }

})

/* Retrieve form data then do api call and post results to the server */
function action(event) {
    // Client.getDate();
    const startDate = document.getElementById('start-date').value;
    const daysToTrip = timeToTrip(startDate);
    if (daysToTrip > 0) {
        getKeys()
            .then(function (keys) {
                cityCallBack(keys)
            })
    } else {
        document.getElementById('city').innerText = `Please enter a date in the future`;
    }
}

/*Get City information */
function cityCallBack(key) {
    const startDate = document.getElementById('start-date').value;
    const startDateObject = new Date(startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate()+1);
    const month = endDate.getMonth() + 1;
    const endDay = endDate.getDate();
    const endDateFormat = `${month}-${endDay}`
    console.log(endDateFormat);
    const daysToTrip = timeToTrip(startDate);
    let baseURL = "http://api.geonames.org/searchJSON?county=us&q=";
    let apiKey = "&username=yojohnyo";
    const zip = document.getElementById('location');
    const endPoint = daysToTrip < 10 ? 'current?' :
        `normals?start_day=${startDateObject.getMonth() + 1}-${startDateObject.getDate() + 1}&end_day=${endDateFormat}&`;
    getCity(baseURL, apiKey, encodeURIComponent(zip.value), key)
        .then(function (cityData) {
            weatherCallback(`https://api.weatherbit.io/v2.0/${endPoint}`, cityData.cityData.geonames[0], cityData.key, daysToTrip)
        });
}

/* Get weather information via callback */
function weatherCallback(weatherBaseUrl, cityData, key, daysToTrip) {
    getWeather(weatherBaseUrl, cityData, key, daysToTrip)
        .then(function (data) {
            console.log(data);
            pixCallBack(data);
        })
}

/* Function to do weather api call */
const getWeather = async ( baseURL, cityData, key, daysToTrip) => {
    const lat = cityData.lat;
    const lon = cityData.lng;
    const response = await fetch(`${baseURL}lat=${lat}&lon=${lon}&key=${key.weatherbitkey}&units=I`)
    try {
        const weatherData = await response.json();
        const weatherInfo = weatherData.data[0];
        const currentTemperature = weatherInfo.app_temp;
        const returnObject = {'locationInfo': cityData, 'key':key, 'weatherInfo': weatherInfo}
        return returnObject;
    }catch(error) {
        console.log("error");
        // appropriately handle the error
    }
}

function pixCallBack(data) {
    console.log(data);
    getPhoto('https://pixabay.com/api/?', data.locationInfo.name, data.key.pixabaykey)
        .then(function (photo) {
            data.photoURL = photo;
            postData('/formData', {'tripInformation': data});
        })
        .then(updateUI);
}

const getPhoto = async (baseURL, city, key) => {
    const response = await fetch(`${baseURL}key=${key}&q=${city}&&category=places&image_type=photo`)
    try {
        const photoData = await response.json();
        const photoURL = photoData.hits[0].webformatURL;
        return photoURL;
    } catch (error) {
        console.log('There was an error with the photo')
    }
};




/* Function to do api call */
const getCity = async ( baseURL, apikey, zip, key ) => {
    const response = await fetch(baseURL+zip+apikey)
    try {
        const cityData = await response.json();
        return {'cityData':cityData, 'key': key}
    }catch(error) {
        console.log("error");
        // appropriately handle the error
    }
}

/* Function to POST data to server */
const postData = async ( url = '', data = {})=>{
    data.tripInformation.tripDate = document.getElementById('start-date').value;
    data.tripInformation.tripEndDate = document.getElementById('end-date').value;
    console.log(data);
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // body data type must match "Content-Type" header
    });

    try {
        const newData = await response.json();
        return newData
    }catch(error) {
        console.log("error", error);
        // appropriately handle the error
    }
}

/* Send get request to get data and update UI to display the last entry */
const updateUI = async () => {
    const request = await  fetch('/all')
    try{
        const allData = await request.json();
        let recentEntry = allData.pop();
        // document.getElementById('response').style.display = "default";
        document.getElementById('city').innerText = `Destination: ${recentEntry.city}, ${recentEntry.adminName1}`;
        document.getElementById('date').innerText = `Trip date(s): ${recentEntry.tripDate} - ${recentEntry.tripEndDate}`;
        document.getElementById('duration').innerText = `Trip duration: ${tripDuration(recentEntry.tripEndDate, recentEntry.tripDate)} days`;
        if (timeToTrip(recentEntry.tripDate) < 10){
            document.getElementById('temp').innerText = `The current temperature is ${recentEntry.weatherInfo.temp} (F)`
        } else {
            document.getElementById('temp').innerText = `The normal high temperature during your trip is ${recentEntry.weatherInfo.temp} (F)`
        }
        console.log(document.getElementById('imgURL').innerText);
        document.getElementById('imgURL').src = recentEntry.photoURL;
        console.log(recentEntry.tripDate);
        document.getElementById('ttt').innerText = `Your trip is in ${timeToTrip(recentEntry.tripDate)} Days`;
        console.log(allData.pop());
    } catch (e) {
        console.log("error".endsWith());

    }
}

export {updateUI}
export {postData}
export {getCity}
export {action}
export {timeToTrip}
export {getWeather}
export {getPhoto}