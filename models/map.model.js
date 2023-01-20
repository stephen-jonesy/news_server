const db = require("../db/connection");
const fs = require("fs/promises");

exports.selectJSON = () => {
    return fs.readFile('endpoints.json', 'utf8')
    .then((data) => {
        // Do something with the data]
        parsedData = JSON.parse(data)
        return parsedData;
    })
    .catch((err) => {
        return Promise.reject({ status: 404, message: "File does not" })

    });

};