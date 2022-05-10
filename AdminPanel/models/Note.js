const mongoose = require("mongoose");

const NoteSchema = new mongoose.Schema({
    Note: String,
    createAt: mongoose.Schema.Types.Number,
});

module.exports = mongoose.model("Note", NoteSchema);
