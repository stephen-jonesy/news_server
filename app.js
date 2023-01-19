const express = require("express");
const { getArticles, getArticleById, updateArticleVotes } = require("./controllers/articlesController");
const { getCommentsByArticleId, postCommentById } = require("./controllers/commentsController");
const { getTopics } = require("./controllers/topicsController");
const { getUsers } = require("./controllers/userController");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);

app.post('/api/articles/:article_id/comments', postCommentById);

app.patch('/api/articles/:article_id', updateArticleVotes);

app.get('/api/users', getUsers);

app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ message: err.message });
    } else next(err);
});
  
app.use((err, req, res, next) => {
    if (err.code === '22P02' || err.code === "23502" ) {
      res.status(400).send({ message: 'Bad request' });
    }else if(err.code === "23503"){
      res.status(404).send({ message: 'Not found' });

    } else next(err);
});
  
app.use((err, req, res, next) => {
    res.status(500).send({ message: 'Internal Server Error' });
});

module.exports = app;
