const { getArticles, getArticleById, updateArticleVotes } = require('../controllers/articlesController');
const { getCommentsByArticleId, postCommentById, removeCommentById } = require('../controllers/commentsController');
const { getJSON } = require('../controllers/mapController');
const { getUsers } = require('../controllers/usersController');
const apiRouter = require('express').Router();
const articlesRouter = require('./articles-router');
const commentsRouter = require('./comments-router');
const topicsRouter = require('./topics-router');
const usersRouter = require('./users-router');

apiRouter.get('/', getJSON);

apiRouter.use("/articles", articlesRouter);

apiRouter.use("/comments", commentsRouter);

apiRouter.use("/topics", topicsRouter);

apiRouter.use('/users', usersRouter);

module.exports = apiRouter;