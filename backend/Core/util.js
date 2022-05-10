const fs = require("fs");

module.exports = class Util {
    constructor(main) {
        this.main = main;
    }

    base64_encode(file) {
        var bitmap = fs.readFileSync(file);
        return new Buffer.from(bitmap).toString("base64");
    }

    generateToken() {
        return token();
    }
};

var rand = function () {
    return Math.random().toString(36).slice(2); // remove `0.`
};

var token = function () {
    return rand() + rand(); // to make it longer
};
