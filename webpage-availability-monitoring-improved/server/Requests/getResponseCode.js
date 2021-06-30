var axios = require("axios");
var data = require("./urls.js");

async function startPolling() {

    data.url.forEach((url, index) => {
        getResponseCode(url, index);
      });


  setInterval(() => {
    data.url.forEach((url, index) => {
      getResponseCode(url, index);
    });
  }, 120000);
}

function getResponseCode(url, numberof) {
  axios
    .get(url)
    .then((res) => {
      data.statuscodes[numberof] = res.status;
    })
    .catch((error) => {
      if (error.response) {
        data.statuscodes[numberof] = error.response.status;
      }
    });
}

module.exports = {
  startPolling: startPolling,
};
