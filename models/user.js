// MONGOOSE MODEL CONFIG
var mongoose = require("mongoose");
mongoose.Promise = global.Promise; 
var passportLocalMongoose = require("passport-local-mongoose");

var UserSchema = new mongoose.Schema({
   username: String,
   password:String
});


UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
