const db = require("../db/connection");

exports.selectUsers = () => {

    const sqlString = `
        SELECT * FROM users;
    `
    return db.query(sqlString);

};