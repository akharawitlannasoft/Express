const mongoose = require('mongoose')
const Schema = mongoose.Schema

const usersSchema = new Schema({
   username: String,
   password: String,
   firstname: String,
   lastname: String,
   status: Number
})

var Users = mongoose.model('users', usersSchema);
module.exports = Users;