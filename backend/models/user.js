const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator'); //Unique validator to give correct error messages

const userSchema = mongoose.Schema({
    email:{ type: String, required: true, unique: true }, //Unique validator for user email
    password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);