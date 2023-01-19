const express = require("express");
const { getArticles, getArticleById, updateArticleVotes } = require("./controllers/articlesController");
const { postCommentById, removeCommentById, getCommentsByArticleId } = require("./controllers/commentsController");
const { getTopics } = require("./controllers/topicsController");
const { getUsers } = require("./controllers/usersController");
const { customErrors, psqlErrors, serverErrors } = require("./errors");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentById);

app.patch('/api/articles/:article_id', updateArticleVotes);

app.get('/api/users', getUsers);

app.delete('/api/comments/:comment_id', removeCommentById);

app.use(customErrors);
  
app.use(psqlErrors);
  
app.use(serverErrors);

module.exports = app;
