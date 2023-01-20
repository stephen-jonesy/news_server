const { getArticles, getArticleById, updateArticleVotes } = require('../controllers/articlesController');
const { getCommentsByArticleId, postCommentById, removeCommentById } = require('../controllers/commentsController');
const { getJSON } = require('../controllers/mapController');
const { getTopics } = require('../controllers/topicsController');
const { getUsers } = require('../controllers/usersController');
const apiRouter = require('express').Router();

apiRouter.get('/', getJSON);

apiRouter.get("/topics", getTopics);

apiRouter.get("/articles", getArticles);

apiRouter.get("/articles/:article_id", getArticleById);

apiRouter.get("/articles/:article_id/comments", getCommentsByArticleId);

apiRouter.post('/articles/:article_id/comments', postCommentById);

apiRouter.patch('/articles/:article_id', updateArticleVotes);

apiRouter.get('/users', getUsers);

apiRouter.delete('/comments/:comment_id', removeCommentById);

module.exports = apiRouter;