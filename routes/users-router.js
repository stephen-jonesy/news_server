const { getUsers } = require('../controllers/usersController');

const usersRouter = require('express').Router()

usersRouter.get('/', getUsers);

module.exports = usersRouter;
