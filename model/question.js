const mongoose = require("mongoose")
const Schema = mongoose.Schema

const questionSchema = new Schema ({
    date : {type : Date, default : Date.now()},
    title : String,
    category : String,
    details : String,
    user : String,
    answers : [{
            user : String,
            comment : String,
    }]
})

module.exports = mongoose.model('question' , questionSchema)