const mongoose = require("mongoose");

const DB_URI =
    "";
	//mongodb+srv://XXXX:XXXXXX@cluster0.sdjtb.mongodb.net/App
//Database connection
mongoose.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

module.exports = connection;
