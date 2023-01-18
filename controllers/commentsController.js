const { selectCommentsByArticleId, selectArticleById, addCommentById } = require("../models/app.model");


exports.getCommentsByArticleId = (req, res, next) => {

    const articleId = req.params.article_id;

    return Promise.all([selectCommentsByArticleId(articleId), selectArticleById(articleId)])
    .then((data) => {
        const {rows} = data[0];
        if (!rows.length) {
            res.status(200).send({message: 'No comments found'})

        }
        else {
            res.status(200).send({comments: rows})

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
        res.status(201).send({comment:rows[0]})
    })
    .catch((err) => {
        next(err);
    });
    
}
