const { getTopics } = require('../controllers/topicsController');
const topicsRouter = require('express').Router();

topicsRouter.get("/", getTopics);

module.exports = topicsRouter;
