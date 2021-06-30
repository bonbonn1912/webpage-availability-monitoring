console.log("js loaded");
var TargetURL = document.querySelectorAll(".statusMessage");
const TargetTime = document.querySelectorAll(".timeMessage");
const TargetBox = document.querySelectorAll("#Box");

$.get("/api/getresponsecodes", (data) => {
  setStatuscode(data);
  setTime(data);
  setColor(data);
});

setInterval(() => {
  console.log("api angefragt");
  $.get("/api/getresponsecodes", (data) => {
    setStatuscode(data);
    setTime(data);
    setColor(data);
  });
}, 120000);

function setStatuscode(statuscodes) {
  statuscodes.forEach((statuscode, index) => {
    TargetURL[index].innerHTML = statuscode;
  });
}

function setColor(statuscodes) {
  const validStatusCodes = [
    200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301, 302, 303, 304,
    305, 306, 307, 308,
  ];
  const clientErrors = [400, 401, 402, 403, 404, 405, 406, 407, 408];
  statuscodes.forEach((statuscode, index) => {
    if (validStatusCodes.includes(statuscode)) {
      var color = "green";
      TargetBox[index].style.backgroundColor = color;
    } else if (clientErrors.includes(statuscode)) {
      var color = "red";
      TargetBox[index].style.backgroundColor = color;
    }
  });
}

function setTime(statuscodes) {
  var hours = new Date().getHours();
  var minutes = new Date().getMinutes();
  var seconds = new Date().getSeconds();
  if (hours < 10) {
    hours = "0" + hours;
  }
  if (minutes < 10) {
    minutes = "0" + minutes
  }
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  var time = hours + ":" + minutes + ":" + seconds;

  statuscodes.forEach((statuscode, index) => {
    TargetTime[index].innerHTML = time;
  });
}
