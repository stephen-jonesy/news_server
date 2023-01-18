const { selectUsers } = require("../models/app.model");


exports.getUsers = (req, res, next) => {

    return selectUsers()
    .then(({rows}) => {
        const users = rows;
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err);
    })

}