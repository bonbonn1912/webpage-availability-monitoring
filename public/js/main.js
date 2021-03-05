const socket = io();


// Wird ausgeführt sobald eine Verbindung aufgebaut wird
socket.on("connect", function(){
    console.log("User connected");
})
console.log("Main.js geladen");