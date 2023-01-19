const { selectArticles, selectArticleById, patchArticleVotes } = require("../models/articles.model");

exports.getArticles = (req, res, next) => {
    return selectArticles(req.query)
    .then((articles) => {
        if (!articles.length) {
            res.status(200).send({message: "Topic doesn't exist"})

        }
        res.status(200).send({articles})
    })
    .catch((err) => {
        next(err);
    })

}
exports.getArticleById = (req, res, next) => {

    const articleId = req.params.article_id;
    return selectArticleById(articleId)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err);
    })
    
}


exports.updateArticleVotes = (req, res, next) => {
    
    const articleId = req.params.article_id;
    const body = req.body;
    
    return patchArticleVotes(body, articleId)
    .then((article) => {
        res.status(200).send({article})
    })
    .catch((err) => {
        next(err);
    })

}
