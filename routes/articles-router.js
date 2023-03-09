const articlesRouter = require("express").Router();
const {
  getArticles,
  getArticleById,
  updateArticleVotes,
  postArticle,
} = require("../controllers/articlesController");
const {
  getCommentsByArticleId,
  postCommentById,
} = require("../controllers/commentsController");

articlesRouter.get("/", getArticles);

articlesRouter.post("/", postArticle);

articlesRouter.get("/:article_id", getArticleById);

articlesRouter.get("/:article_id/comments", getCommentsByArticleId);

articlesRouter.post("/:article_id/comments", postCommentById);

articlesRouter.patch("/:article_id", updateArticleVotes);

module.exports = articlesRouter;
