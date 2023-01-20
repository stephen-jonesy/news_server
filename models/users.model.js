const db = require("../db/connection");

exports.selectUsers = () => {

    const sqlString = `
        SELECT * FROM users;
    `
    return db.query(sqlString)
    .then(({rows}) => {
        return rows;
    });

};

exports.selectUserByUsername = ({username}) => {
    const sqlString = `
        SELECT * FROM users
        where username = $1;
    
    `;

    return db.query(sqlString, [username])
    .then(({rows}) => {
        if (!rows.length) {
            return Promise.reject({ status: 404, message: "Opps, user does not exist" })
        }
        return rows[0];

    });
};