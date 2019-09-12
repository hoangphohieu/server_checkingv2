var express = require("express");
var bodyParser = require('body-parser')
var cors = require('cors')

var app = express();
// connect db
require("./db.js");

//set public
// app.use(express.static('public'))

//load middleware
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(cors())

app.use((req,res,next)=>{
    res.append('Access-Control-Allow-Credentials', 'true');
    res.append('Access-Control-Expose-Headers', 'X-Total-Count')
    next();
})

//import controller
var userController = require("./controller/user.controller");

//routers
app.use("/api/users",userController)



var port = process.env.PORT||7000;
app.listen(port, function () {
    console.log(`server on port ${port}`)
})