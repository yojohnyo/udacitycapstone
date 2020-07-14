/* Global Variables */

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.getMonth()+'.'+ d.getDate()+'.'+ d.getFullYear();

let baseURL = "http://api.geonames.org/postalCodeSearchJSON?postalcode=";
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
    console.log(zip.value);
    const note = document.getElementById('feelings');
    getCity(baseURL, apiKey, zip.value)
        .then(function (data) {
            postData('/formData', {'zip':zip.value, 'placeNames':data.postalCodes});
        })
        .then(updateUI);
}


/* Function to do api call */
const getCity = async ( baseURL, key, zip) => {
    const response = await fetch(baseURL+zip+key)
    console.log(baseURL+zip+key)
    try {
        const newData = await response.json();
        console.log(newData);
        return newData
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
        console.log(recentEntry.temp);
        document.getElementById('date').innerText = `Entry Date: ${recentEntry.date}`;
        document.getElementById('temp').innerText = `Temperature (F): ${recentEntry.temp}`;
        document.getElementById('content').innerText = `Note: ${recentEntry.note}`;
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