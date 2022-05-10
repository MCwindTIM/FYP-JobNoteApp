const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    email: String,
    UserToken: String,
    avatar: String,
});

module.exports = mongoose.model("User", UserSchema);
