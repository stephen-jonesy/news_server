const { getUsers, getUsersByUsername } = require('../controllers/usersController');

const usersRouter = require('express').Router()

usersRouter.get('/', getUsers);

usersRouter.get('/:username', getUsersByUsername);

module.exports = usersRouter;
