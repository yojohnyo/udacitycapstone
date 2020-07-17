/* Global Variables */



const timeToTrip = (tripStartDate) => {
    const tripStart = new Date(tripStartDate);
    const today = new Date();
    return Math.ceil((tripStart.getTime()-today.getTime())/(1000*24*3600));
}

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

let baseURL = "http://api.geonames.org/searchJSON?county=us&q=";
let apiKey = "&username=yojohnyo";

/* Event listener for Generate Click */
const generateButton = document.getElementById('generate');
generateButton.addEventListener('click', action);

/*Event listener for enter key */
document.addEventListener('keyup', function (e) {
    if (e.key === 'Enter') {
        action()
    }

})

/* Retrieve form data then do api call and post results to the server */
function action(event) {
    console.log("In action")
    // Client.getDate();
    const zip = document.getElementById('location');
    const daysToTrip = timeToTrip(document.getElementById('start-date').value);
    const endPoint = timeToTrip(document.getElementById('start-date').value) < 10 ? 'current?' : 'forecast/daily?';
    const note = document.getElementById('feelings');
    getCity(baseURL, apiKey, encodeURIComponent(zip.value))
        .then(function (cityData) {
            const lat = cityData.geonames[0].lat;
            const lon = cityData.geonames[0].lng;
            const key = '73a9328c1fd5491c9c60fc3e8349f22a';
            weatherCallback(`https://api.weatherbit.io/v2.0/${endPoint}`, lat, lon, key, daysToTrip)
        })
        // .then(function (data) {
        //     postData('/formData', {'zip':zip.value, 'placeNames':data});
        // })
        // .then(updateUI);
}

function weatherCallback(weatherBaseUrl, lat, lon, key, daysToTrip) {
    getWeather(weatherBaseUrl, lat, lon, key, daysToTrip)
        .then(function (data) {
            postData('/formData', {'zip':lat, 'placeNames':data});
        })
        .then(updateUI);
}

/* Function to do api call */
const getWeather = async ( baseURL, lat, lon, key, daysToTrip) => {
    console.log(lat);
    const response = await fetch(`${baseURL}lat=${lat}&lon=${lon}&key=${key}`)
    try {
        const weatherData = await response.json();
        const weatherInfo = weatherData.data[0];
        console.log(weatherInfo);
        const currentTemperature = weatherInfo.app_temp;
        const returnObject = {'locationInfo': weatherInfo, 'timeToTrip': daysToTrip}
        console.log(returnObject);
        return returnObject;
    }catch(error) {
        console.log("error");
        // appropriately handle the error
    }
}





/* Function to do api call */
const getCity = async ( baseURL, key, zip) => {
    const response = await fetch(baseURL+zip+key)
    console.log(zip);
    try {
        const cityData = await response.json();
        return cityData
    }catch(error) {
        console.log("error");
        // appropriately handle the error
    }
}

/* Function to POST data to server */
const postData = async ( url = '', data = {})=>{
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
        console.log(newData.base);
        return newData
    }catch(error) {
        console.log('hello');
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
        console.log(recentEntry.latitude);
        console.log(recentEntry);
        console.log(weatherInfo)
        document.getElementById('response').style.display = "block";
        document.getElementById('city').innerText = `Destination: ${recentEntry.city}, ${recentEntry.adminName1}`;
        document.getElementById('date').innerText = `Trip start date: ${tripStartDate}`;

        document.getElementById('temp').innerText = `Temperature (F): ${timeToTrip(document.getElementById('start-date').value)} Days`;
        // document.getElementById('content').innerText = `Note: ${recentEntry.note}`;
        console.log(allData.pop());
    } catch (e) {
        console.log("error".endsWith());

    }
}

export {updateUI}
export {postData}
export {getCity}
export {action}
export {generateButton}