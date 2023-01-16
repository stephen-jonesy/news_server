const express = require("express");
const { getTopics, getArticles, getArticleById, getCommentsByArticleId } = require("./controllers/app.controller");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.get("/api/articles", getArticles);

app.get("/api/articles/:article_id", getArticleById);

app.get("/api/articles/:article_id/comments", getCommentsByArticleId);


app.use((err, req, res, next) => {
    if (err.status === 404) {
      res.status(err.status).send({ message: err.message });
    } else next(err);
});
  
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ message: 'Bad request' });
    } else next(err);
});
  
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ message: 'Internal Server Error' });
});

module.exports = app;
