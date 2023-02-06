const express = require("express");
const { getArticles, getArticleById, updateArticleVotes } = require("./controllers/articlesController");
const { postCommentById, removeCommentById, getCommentsByArticleId } = require("./controllers/commentsController");
const { getTopics } = require("./controllers/topicsController");
const { getUsers } = require("./controllers/usersController");
const { customErrors, psqlErrors, serverErrors } = require("./errors");
const fs = require("fs/promises");
const { getJSON } = require("./controllers/mapController");
const apiRouter = require('./routes/api-router');
const cors = require('cors');

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api', apiRouter);

app.use(customErrors);
  
app.use(psqlErrors);
  
app.use(serverErrors);

module.exports = app;
