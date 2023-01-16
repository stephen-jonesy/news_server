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
    return db.query(sqlString);

}