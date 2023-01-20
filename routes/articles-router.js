const articlesRouter = require('express').Router();
const { getArticles, getArticleById, updateArticleVotes } = require('../controllers/articlesController');
const { getCommentsByArticleId, postCommentById } = require('../controllers/commentsController');

articlesRouter.get("/", getArticles);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

articlesRouter.post('/:article_id/comments', postCommentById);

articlesRouter.patch('/:article_id', updateArticleVotes);

module.exports = articlesRouter;
