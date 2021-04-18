const mongoose = require("mongoose") 
const Schema = mongoose.Schema 

const userSchema = new Schema({
    firstName : String,
    lastName : String,
    username : String,
    dateOfBirth : Date,
    password : String,
    email : String,
    mobile : String,
    gender : String,
    state : String,
    profilePhoto : String,
}) 
 
module.exports = mongoose.model('user' , userSchema)