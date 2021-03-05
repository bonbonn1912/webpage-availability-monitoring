var socket = io.connect("http://localhost:3000");

// Zugriff auf die Elemente der Seite 
const TargetURL = document.querySelectorAll(".statusMessage");
const TargetTime = document.querySelectorAll(".timeMessage");

// Wird ausgeführt sobald eine Verbindung aufgebaut wird
socket.on("connect", function(){
    console.log("User connected");
    socket.emit("Initialfetch");
})



socket.on("UpdateURL", function({statusCode, index, GlobalTime}){
 changeStatusCode(statusCode, index, GlobalTime)
 console.log("Websocket Anfrage erhalten");
})

socket.on("InitData", function({statusCode, index, LastTime}){
    changeStatusCode(statusCode, index,LastTime)
    console.log("Websocket Anfrage erhalten");
   })
   

function changeStatusCode(statusCode, index, GlobalTime){
    
    TargetURL[index-1].innerHTML = "Statuscode: "+statusCode;
    TargetTime[index-1].innerHTML = GlobalTime;
}
console.log("Main.js geladen");