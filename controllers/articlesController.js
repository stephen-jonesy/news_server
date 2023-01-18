const { selectArticles, selectArticleById, patchArticleVotes } = require("../models/app.model");

exports.getArticles = (req, res, next) => {
    
    return selectArticles()
    .then(({rows}) => {
        const articles = rows;
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err);
    })

}

exports.getArticleById = (req, res, next) => {

    const articleId = req.params.article_id;
    return selectArticleById(articleId)
    .then(({rows}) => {
        res.status(200).send({article: rows[0]})
    })
    .catch((err) => {
        next(err);
    })
    
}


exports.updateArticleVotes = (req, res, next) => {
    
    const articleId = req.params.article_id;
    const body = req.body;
    
    return patchArticleVotes(body, articleId)
    .then(({rows}) => {
        res.status(200).send({comment: rows[0]})
    })
    .catch((err) => {
        next(err);
    })

}
