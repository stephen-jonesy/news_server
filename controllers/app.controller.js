const { selectTopics, selectArticles } = require("../models/app.model")

exports.getTopics = (req, res, next) => {

    return selectTopics()
    .then(({rows}) => {
        res.status(200).send(rows)
    })
    .catch((err) => {
        next(err);
    })

}

exports.getArticles = (req, res, next) => {
    return selectArticles()
    .then(({rows}) => {
        res.status(200).send(rows)
    })
    .catch((err) => {
        next(err);
    })

}