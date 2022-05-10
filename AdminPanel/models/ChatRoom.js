const mongoose = require("mongoose");

const ChatRoomSchema = new mongoose.Schema({
    lastMessage: mongoose.Schema.Types.ObjectId,
    Users: mongoose.Schema.Types.Array,
});

module.exports = mongoose.model("ChatRoom", ChatRoomSchema);
