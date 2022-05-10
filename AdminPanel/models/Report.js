const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema({
    User_id: mongoose.Schema.Types.ObjectId,
    Job_id: mongoose.Schema.Types.ObjectId,
    reportTimestamp: mongoose.Schema.Types.Number,
    reportReason: String,
});

module.exports = mongoose.model("Report", ReportSchema);
