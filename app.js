const express = require("express");
const { getTopics } = require("./controllers/app.controllers");

const app = express();

app.use(express.json());

app.get("/api/topics", getTopics);

app.use((err, req, res, next) => {
    if (err.status) {
      res.status(err.status).send({ msg: err.msg });
    } else next(err);
});
  
app.use((err, req, res, next) => {
    if (err.code === '22P02') {
      res.status(400).send({ msg: 'Invalid input' });
    } else next(err);
});
  
app.use((err, req, res, next) => {
    console.log(err);
    res.status(500).send({ msg: 'Internal Server Error' });
});

module.exports = app;
