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
        where articles.article_id = $1;

    `

    return db.query(sqlString, [articleId])
    .then((data) => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, message: "Opps, article does not exist" })
        }
        return data;

    })
}

exports.selectCommentsByArticleId = (articleId) => {
    const sqlComments = `
        SELECT * FROM comments
        where comments.article_id = $1
        ORDER BY created_at DESC;
    `;

    return db.query(sqlComments,[articleId])
    .then((data)=> {
        return data;
    })
}

exports.addCommentById = (articleId, {username, body}) => {
    const sqlString = `
        INSERT INTO comments
        (body, article_id, author)
        VALUES ($1, $2, $3) RETURNING *;
    `;
    return db.query(sqlString, [body, articleId, username])
    
}


exports.patchArticleVotes = ({inc_votes}, articleId) => {

    const sqlString = `
        UPDATE articles
        SET votes = votes + $1
        WHERE article_id = $2
        returning *;
    
    `;

    return db.query(sqlString, [inc_votes, articleId])
    .then((data) => {
        return data;

    })
}