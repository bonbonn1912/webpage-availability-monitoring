
require('@google-cloud/debug-agent').start({serviceContext: {enableCanary: true}});


var http = require("http");
var https = require("https");

var express = require("express");
const { EEXIST } = require('constants');
var app = express();
var httpServer = http.createServer(app);

var io = require("socket.io")(httpServer);

var moment = require("moment");
var timezone = require("moment-timezone");
const PORT = process.env.PORT || 8080;
const PollRate = 2000;

var GlobalTime;
var LastTime;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.render("index");
});

var URls = [
  "https://www.google.de",
  "https://www.bild.de",
  "https://www.dominikw.de/dqwdq.html",
  // "https://www.facebook.com",
  "https://www.twitch.tv",
  "https://www.linkedin.com",
  "https://www.twitter.com",
  "https://www.instagram.com",
  "https://www.faceit.com",
  "https://www.faz.net/aktuell/",
];

var URlStatus = [];

setInterval(() => {
  URls.forEach((element) => {
    getResponseCode(element, URls.indexOf(element) + 1);
  });
  var LoggingTest  = URlStatus;

  
}, PollRate);

function getResponseCode(url, numberof) {
  https.get(url, function (res) {
    URlStatus[numberof - 1] = res.statusCode;
  });
}

setInterval(() => {
  GlobalTime = getTimeInHMS();
  LastTime = GlobalTime;
}, PollRate);

function getTimeInHMS() {
 
  var string = moment.tz(Date.now(), "Europe/Paris").format("H:mm:ss")
  return string;
}

io.on("connection", function (socket) {
  setInterval(() => {
    socket.emit("communicate");
  }, 1000);
  socket.on("Initialfetch", function (message) {
    for (i = 0; i < URls.length; i++) {
      var index = i;
      var statusCode = URlStatus[i];

      color = setResponseColor(URlStatus[i]);
      index++;
      socket.emit("InitData", { statusCode, index, LastTime, color });
    }
  });

  setInterval(() => {
    var i;
    for (i = 0; i < URls.length; i++) {
      var index = i + 1;
      var statusCode = URlStatus[i];
      var color = setResponseColor(URlStatus[i]);
      socket.emit("UpdateURL", { statusCode, index, GlobalTime, color });
    }
  }, PollRate);
});

function setResponseColor(responseCode) {
  var color;
  switch (responseCode) {
    case 200:
      color = "green";
      break;
    case 201:
      color = "green";
      break;
    case 202:
      color = "green";
      break;
    case 203:
      color = "green";
      break;
    case 300:
      color = "green";
      break;
    case 301:
      color = "green";
      break;
    case 302:
      color = "green";
      break;
    case 400:
      color = "red";
      break;
    case 401:
      color = "red";
      break;
    case 402:
      color = "red";
      break;
    case 403:
      color = "red";
      break;
    case 404:
      color = "red";
      break;
    case 500:
      color = "red";
      break;
    case 501:
      color = "red";
      break;
    case 502:
      color = "red";
      break;
  }
  return color;
}

httpServer.listen(PORT, function () {
  console.log("Server listening on Port: " + PORT);
});
