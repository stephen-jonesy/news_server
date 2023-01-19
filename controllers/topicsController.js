const { selectTopics } = require("../models/topics.model");

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