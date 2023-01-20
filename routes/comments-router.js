const { removeCommentById } = require('../controllers/commentsController');
const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', removeCommentById);

module.exports = commentsRouter;