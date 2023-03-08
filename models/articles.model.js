const db = require("../db/connection");

exports.selectArticles = ({ topic, sort_by, order, limit, page }) => {
  const queryValues = [];

  const validSortBys = [
    "title",
    "topic",
    "author",
    "body",
    "created_at",
    "article_img_url",
    "votes",
    "comment_count",
  ];

  const validOrderBys = ["asc", "desc"];

  const limitFormated = !limit ? "10" : limit;

  let sqlString = `
        SELECT articles.*, COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
    `;

  if (topic) {
    sqlString += `HAVING topic = $1 `;
    queryValues.push(topic);
  }

  if (sort_by && !validSortBys.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Invalid sort query" });
  }

  if (order && !validOrderBys.includes(order)) {
    return Promise.reject({ status: 400, message: "Invalid order query" });
  }

  if (limit && !/^\d+$/.test(limit)) {
    return Promise.reject({ status: 400, message: "Invalid limit query" });
  }

  if (page && !/^\d+$/.test(page)) {
    return Promise.reject({ status: 400, message: "Invalid page query" });
  }

  sqlString += `ORDER BY ${
    sort_by === undefined ? "articles.created_at" : `articles.${sort_by}`
  } ${order === undefined ? "DESC" : order}
  `;

  const lookingFor = "comment_count";

  let countSqlString = sqlString.substring(
    sqlString.indexOf(lookingFor) + lookingFor.length
  );

  countSqlString = "SELECT COUNT(articles.title)" + countSqlString;

  sqlString += `LIMIT ${limitFormated}  OFFSET ${
    !page ? "0" : limitFormated * (page - 1)
  };`;

  const sqlTable = db.query(sqlString, queryValues);
  const sqlCount = db.query(countSqlString, queryValues);
  return Promise.all([sqlTable, sqlCount]).then((value) => {
    if (!value[0].rows.length) {
      if (topic) {
        return { articles: value[0].rows, articles_count: value[1].rowCount };
      }
      return Promise.reject({ status: 404, message: "No articles exist" });
    }
    return { articles: value[0].rows, articles_count: value[1].rowCount };
  });
};

exports.selectArticleById = (articleId) => {
  const sqlString = `
        SELECT articles.*, COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        HAVING articles.article_id = $1;
        
    `;

  return db.query(sqlString, [articleId]).then(({ rows }) => {
    if (!rows.length) {
      return Promise.reject({
        status: 404,
        message: "Opps, article does not exist",
      });
    }
    return rows[0];
  });
};

exports.patchArticleVotes = ({ inc_votes }, articleId) => {
  const sqlString = `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        returning *;
    
    `;

  return db.query(sqlString, [inc_votes, articleId]).then(({ rows }) => {
    return rows[0];
  });
};
