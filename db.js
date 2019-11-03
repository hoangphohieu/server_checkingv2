// const config = require('config');
var mongoose = require('mongoose');
var dbuser="nghiahsgs";
var dbpassword = "nghia261997m";

//console.log(dbuser)
// console.log(dbpassword)


mongoose.connect(`mongodb://${dbuser}:${dbpassword}@ds141248.mlab.com:41248/server_smartphone_hieu`,
 { useNewUrlParser: true });

// mongoose.connect('mongodb://localhost:27017/server_smartphone_hieu', { useNewUrlParser: true });


console.log("connect db success");