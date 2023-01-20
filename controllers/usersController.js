const { selectUsers, selectUserByUsername } = require("../models/users.model");


exports.getUsers = (req, res, next) => {

    return selectUsers()
    .then((users) => {
        res.status(200).send({users})
    })
    .catch((err) => {
        next(err);
    })

}

exports.getUsersByUsername = (req,res, next) => {
    
    return selectUserByUsername(req.params)
    .then((user) => {
        res.status(200).send({user});
    })
    .catch((err) => {
        next(err);
    })
};