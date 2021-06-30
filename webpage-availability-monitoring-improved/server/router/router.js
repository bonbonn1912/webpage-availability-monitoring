var express = require('express');
var router = express.Router();
var createResponse = require('../createResObjects/resObjects.js');


router.get("/", (req, res) =>{
    res.render("index");
})

router.get("/api/getresponsecodes", (req, res) =>{ createResponse.createAjaxResponse(res)})
   
    


module.exports = router;