const { selectTopics, selectArticles, selectArticleById, addCommentById } = require("../models/app.model")

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

exports.getArticleById = (req, res, next) => {
    const articleId = req.params.article_id;
    return selectArticleById(articleId)
    .then(({rows}) => {
        res.status(200).send(rows)
    })
    .catch((err) => {
        next(err);
    })
}

exports.postCommentById = (req, res, next) => {
    const articleId = req.params.article_id;
    const { body } = req;

    return addCommentById(articleId, body)
    .then(({rows}) => {
        console.log(rows);
        res.status(201).send(rows)
    })
    .catch((err) => {
        next(err);
    });
}