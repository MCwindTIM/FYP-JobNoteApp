const mongoose = require("mongoose");

const JobSchema = new mongoose.Schema({
    Title: String,
    Details: String,
    Author: String,
    AuthorID: mongoose.Schema.Types.ObjectId,
    Timestamp: mongoose.Schema.Types.Number,
});

module.exports = mongoose.model("Job", JobSchema);
