
require('@google-cloud/debug-agent').start({allowExpressions: true},{serviceContext: {enableCanary: true}});


var http = require("http");
var https = require("https");

var express = require("express");
const { EEXIST } = require('constants');

const bunyan = require('bunyan');
const {LoggingBunyan} = require('@google-cloud/logging-bunyan');
const loggingBunyan = new LoggingBunyan();

var app = express();
var httpServer = http.createServer(app);

var io = require("socket.io")(httpServer);

var moment = require("moment");
var timezone = require("moment-timezone");
const PORT = process.env.PORT || 8080;
const PollRate = 120000;

var GlobalTime;
var LastTime;

app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));

app.get("/", function (req, res) {
  res.render("index");
});

const logger = bunyan.createLogger({
  // The JSON payload of the log as it appears in Cloud Logging
  // will contain "name": "my-service"
  name: 'my-service',
  streams: [
    // Log to the console at 'info' and above
    {stream: process.stdout, level: 'info'},
    // And log to Cloud Logging, logging at 'info' and above
    loggingBunyan.stream('info'),
  ],
});

var URls = [

  "https://www.deutsche-bank.de/marktdaten/maerkte/aktien.html/",
  "https://www.deutsche-bank.de/pk/finanzcheck.html",
  "https://www.deutsche-bank.de/ub.html",
  "https://www.deutsche-bank.de/pk/service-und-kontakt/service-ueberblick.html",
  "https://www.deutsche-bank.de/pk/kredit-und-immobilien/kredit/privatkredit.html",
  "https://www.deutsche-bank.de/pk/konto-und-karte/konten-im-ueberblick/konten-im-vergleich.html",
  "https://www.deutsche-bank.de/pk/digital-banking/mobile-apps.html",
  "https://www.deutsche-bank.de/pk/vorsorge/private-altersvorsorge.html",
  "https://meine.deutsche-bank.de/trxm/db/",
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
    }).on("error", function(error){
      URlStatus[numberof - 1] = "Server nicht erreichbar";
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
      // Writes some log entries
   // logger.error('Is this Working');
  //  logger.info('Logging');
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
  if(responseCode != undefined){
  var digit = responseCode.toString();
  switch (digit[0]) {
    case "2":
      color = "green";
      break;
   
    case "3":
      color = "green";
      break;
    case "4":
      color = "red";
      break;
    case "5":
      color = "red";
      break;
    
     default:
       color = "red";

  }
  return color;
}
  }
 

httpServer.listen(PORT, function () {
  console.log("Server listening on Port: " + PORT);
});
