const db = require('../db/connection')

exports.selectTopics = () => {
    const sqlString = `
        SELECT * FROM topics;
    `
    return db.query(sqlString);
}

exports.selectArticles = () => {
    const sqlString = `
        SELECT articles.*, COUNT(comments.article_id) as comment_count 
        FROM articles
        JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        ORDER BY created_at DESC;
    `
    return db.query(sqlString)
    .then((data) => {
        if (!data.rows.length) {
                return Promise.reject({ status: 404, message: "Opps, article does not exist" });
        }
        return data;

    })

}

exports.selectArticleById = (articleId) => {

    const sqlString = `
        SELECT * FROM articles
        where articles.article_id = $1
        ORDER BY created_at DESC;

    `

    return db.query(sqlString, [articleId])
    .then((data) => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, message: "Opps, article does not exist" })
        }
        return data;

    })
}

exports.addCommentById = (articleId, {username, body}) => {
    console.log(body, articleId, username);
    const sqlString = `
        INSERT INTO comments
        (body, article_id, author)
        VALUES ($1, $2, $3) RETURNING *;
    `;
    return db.query(sqlString, [body, articleId, username])
}
