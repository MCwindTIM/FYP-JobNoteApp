const mongoose = require("mongoose");

const FollowingSchema = new mongoose.Schema({
    User_id: mongoose.Schema.Types.ObjectId,
    Job_id: mongoose.Schema.Types.ObjectId,
});

module.exports = mongoose.model("Following", FollowingSchema);
