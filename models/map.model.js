const db = require("../db/connection");
const fs = require("fs/promises");

exports.selectJSON = () => {
    return fs.readFile('endpoints.json', 'utf8')
    .then((data) => {
        parsedData = JSON.parse(data)
        return parsedData;
    })

};