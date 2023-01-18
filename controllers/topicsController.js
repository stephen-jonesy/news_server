const { selectTopics } = require("../models/app.model");


exports.getTopics = (req, res, next) => {

    return selectTopics()
    .then(({rows}) => {
        const topics = rows;
        res.status(200).send({topics})
    })
    .catch((err) => {
        next(err);
    })

}