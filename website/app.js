/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

let baseURL = "http://api.openweathermap.org/data/2.5/weather?zip=";
let apiKey = "&appid=588f892ff7353c2335191fa7b7ea05d1&units=imperial";

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
    const zip = document.getElementById('zip');
    const note = document.getElementById('feelings');
    getWeather(baseURL, apiKey, zip.value)
        .then(function (data) {
            postData('/formData', {'zip':zip.value, 'date': newDate, 'temp':data.main.temp, 'note': note.value});
        })
        .then(updateUI);
}


/* Function to do api call */
const getWeather = async ( baseURL, key, zip) => {
    const response = await fetch(baseURL+zip+key)
    try {
        const newData = await response.json();
        console.log(newData.main.temp);
        return newData
    }catch(error) {
        console.log("error".error);
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
        document.getElementById('date').innerText = `Entry Date: ${recentEntry.date}`;
        document.getElementById('temp').innerText = `Temperature (F): ${recentEntry.temp}`;
        document.getElementById('content').innerText = `Note: ${recentEntry.note}`;
        console.log(allData.pop());
    } catch (e) {
        console.log("error".endsWith());

    }
}