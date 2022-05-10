const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
    content: String,
    CR_id: mongoose.Schema.Types.ObjectId,
    Author: mongoose.Schema.Types.ObjectId,
    createAt: mongoose.Schema.Types.Number,
});

module.exports = mongoose.model("Message", MessageSchema);
