const dotenv = require('dotenv');
dotenv.config();
var path = require('path')

const express = require('express')

const app = express()
const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Initialize the main project folder
app.use(express.static('dist'));

// Cors for cross origin allowance
const cors = require('cors');
app.use(cors());

// Setup Server
const port = 5000;
const server = app.listen(port, listening);
function listening(){
    // console.log(server);
    console.log(`running on localhost: ${port}`);
};

let cityData = [];
let postData=[];

app.post('/formData', getZip);

// // GET route
app.get('/all', sendData);

function sendData (request, response) {
    console.log("In post data");
    console.log(postData);
    response.send(postData);
};



function getZip(req, res) {
    newEntry = {
        zip: req.body.zip,
        date: req.body.date,
        temp: req.body.temp,
        note: req.body.note
    }
    postData.push()
    postData.push(req.body);
    console.log(req.body);
}