var express = require('express');
var routing = require('./server/router/router.js');
var start = require('./server/Requests/getResponseCode.js');
const path = require('path');


var app = express();


const PORT = process.env.PORT || 1337;
app.set('views', path.join(__dirname, '/client/views'))
app.set('view engine','ejs');

app.use(express.static(__dirname + '/client/public'));
app.use("/",routing);

app.listen(PORT, () => console.log("App Listening on Port: " + PORT));

start.startPolling();