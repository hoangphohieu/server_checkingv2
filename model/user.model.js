var mongoose = require("mongoose");
var Schema = mongoose.Schema;

//create Schema
var userSchema = new Schema({

    // fullname: {
    //     type: String,
    //     require: true
    // },
    // username: {
    //     type: String,
    //     require: true
    // },
    // password: {
    //     type: String,
    //     require: true
    // },
    item_post:{
        type:Object,
        require: true
    }

})

//create model
var userModel = mongoose.model("user", userSchema);

module.exports = userModel;