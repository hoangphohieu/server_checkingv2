// const config = require('config');
var mongoose = require('mongoose');
var dbuser="nghiahsgs";
var dbpassword = "nghia261997";

console.log(dbuser)
// console.log(dbpassword)

// mongoose.connect(`mongodb://${dbuser}:${dbpassword}@ds151076.mlab.com:51076/react_node_login_jwt`,
//  { useNewUrlParser: true });

mongoose.connect('mongodb://localhost:27017/server_smartphone_hieu', { useNewUrlParser: true });


console.log("connect db success");