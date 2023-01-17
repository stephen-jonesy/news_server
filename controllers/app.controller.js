const { selectTopics, selectArticles, selectArticleById, selectCommentsByArticleId, addCommentById, patchArticleVotes } = require("../models/app.model")

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

exports.getCommentsByArticleId = (req, res, next) => {

    const articleId = req.params.article_id;

    return Promise.all([selectCommentsByArticleId(articleId), selectArticleById(articleId)])
    .then((data) => {
        const {rows} = data[0];
        if (!rows.length) {
            res.status(200).send({message: 'No comments found'})

        }
        else {
            res.status(200).send(rows)

        }

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
        res.status(201).send(rows)
    })
    .catch((err) => {
        next(err);
    });
}

exports.updateArticleVotes = (req, res, next) => {
    const articleId = req.params.article_id;
    const body = req.body;

    return patchArticleVotes(body, articleId)
    .then(({rows}) => {
        res.status(200).send(rows)
    })
    .catch((err) => {
        next(err);
    })
}