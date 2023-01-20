const { removeCommentById, updateCommentVotes } = require('../controllers/commentsController');
const commentsRouter = require('express').Router();

commentsRouter.delete('/:comment_id', removeCommentById);

commentsRouter.patch('/:comment_id', updateCommentVotes);

module.exports = commentsRouter;