const { selectArticleById } = require("../models/articles.model");
const { selectCommentsByArticleId, addCommentById, deleteCommentById } = require("../models/comments.app");

exports.getCommentsByArticleId = (req, res, next) => {

    const articleId = req.params.article_id;

    return Promise.all([selectCommentsByArticleId(articleId), selectArticleById(articleId)])
    .then((data) => {
        const comments = data[0];
        if (!comments.length) {
            res.status(200).send({message: 'No comments found'})

        }
        else {
            res.status(200).send({comments})

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
    .then((comment) => {
        res.status(201).send({comment});
    })
    .catch((err) => {
        next(err);
    });
    
}

exports.removeCommentById = (req, res, next) => {

    const {comment_id} = req.params;
    return deleteCommentById(comment_id)
    .then(() => {
        res.status(204).send();
    })
    .catch((err) => {

        next(err);
    })
}

