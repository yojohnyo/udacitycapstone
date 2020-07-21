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
    const startDate = document.getElementById('start-date').value;
    const startDateObject = new Date(startDate);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate()+1);
    console.log(endDate);
    const month = endDate.getMonth() + 1;
    const endDay = endDate.getDate();
    const endDateFormat = `${month}-${endDay}`
    console.log(endDateFormat);
    const daysToTrip = timeToTrip(startDate);
    const endPoint = daysToTrip < 10 ? 'current?' :
        `normals?start_day=${startDateObject.getMonth()+1}-${startDateObject.getDate()+1}&end_day=${endDateFormat}&`;
    console.log(endPoint);
    const note = document.getElementById('feelings');
    getCity(baseURL, apiKey, encodeURIComponent(zip.value))
        .then(function (cityData) {
            const key = '73a9328c1fd5491c9c60fc3e8349f22a';
            weatherCallback(`https://api.weatherbit.io/v2.0/${endPoint}`, cityData.geonames[0], key, daysToTrip)
        })
}

function weatherCallback(weatherBaseUrl, cityData, key, daysToTrip) {
    getWeather(weatherBaseUrl, cityData, key, daysToTrip)
        .then(function (data) {
            console.log(data);
            pixCallBack(data);
        })
}

/* Function to do api call */
const getWeather = async ( baseURL, cityData, key, daysToTrip) => {
    const lat = cityData.lat;
    const lon = cityData.lng;
    const response = await fetch(`${baseURL}lat=${lat}&lon=${lon}&key=${key}&units=I`)
    try {
        const weatherData = await response.json();
        const weatherInfo = weatherData.data[0];
        const currentTemperature = weatherInfo.app_temp;
        const returnObject = {'locationInfo': cityData, 'weatherInfo': weatherInfo, 'tripDate': document.getElementById('start-date').value}
        return returnObject;
    }catch(error) {
        console.log("error");
        // appropriately handle the error
    }
}

function pixCallBack(data) {
    getPhoto('https://pixabay.com/api/?', data.locationInfo.name)
        .then(function (photo) {
            data.photoURL = photo;
            console.log(photo);
            postData('/formData', {'tripInformation': data});
        })
        .then(updateUI);
}

const getPhoto = async (baseURL, city) => {
    const key = '17534911-9154ec6bb132fa66506840f2d';
    const response = await fetch(`${baseURL}key=${key}&q=${city}&image_type=photo`)
    try {
        const photoData = await response.json();
        console.log(photoData);
        const photoURL = photoData.hits[0].webformatURL;
        return photoURL;
    } catch (error) {
        console.log('There was an error with the photo')
    }
};




/* Function to do api call */
const getCity = async ( baseURL, key, zip) => {
    const response = await fetch(baseURL+zip+key)
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
        document.getElementById('response').style.display = "flex";
        document.getElementById('city').innerText = `Destination: ${recentEntry.city}, ${recentEntry.adminName1}`;
        document.getElementById('date').innerText = `Trip start date: ${recentEntry.tripDate}`;
        if (recentEntry.tripDate < 10){
            document.getElementById('temp').innerText = `The current temperature is ${recentEntry.weatherInfo.temp} (F)`
        } else {
            document.getElementById('temp').innerText = `The normal high temperature during your trip is ${recentEntry.weatherInfo.temp} (F)`
        }
        console.log(document.getElementById('imgURL').innerText);
        document.getElementById('imgURL').src = recentEntry.photoURL;
        document.getElementById('ttt').innerText = `Your trip is in ${timeToTrip(recentEntry.tripDate)} Days`;
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