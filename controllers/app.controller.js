const { selectTopics, selectCommentsByArticleId } = require("../models/app.model")

exports.getTopics = (req, res, next) => {

    return selectTopics()
    .then(({rows}) => {
        res.status(200).send(rows)
    })
    .catch((err) => {
        next(err);
    })

}

exports.getCommentsByArticleId = (req, res, next) => {

    const articleId = req.params.article_id;
    return selectCommentsByArticleId(articleId)
    .then(({rows}) => {
        res.status(200).send(rows)
    })
    .catch((err) => {
        next(err);
    })
}