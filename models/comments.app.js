const db = require('../db/connection')

exports.selectCommentsByArticleId = (articleId) => {
    const sqlComments = `
        SELECT * FROM comments
        WHERE comments.article_id = $1
        ORDER BY created_at DESC;
    `;

    return db.query(sqlComments,[articleId])
    .then(({rows})=> {
        return rows;
    })
}

exports.addCommentById = (articleId, {username, body}) => {
    const sqlString = `
        INSERT INTO comments
        (body, article_id, author)
        VALUES ($1, $2, $3) RETURNING *;
    `;
    return db.query(sqlString, [body, articleId, username])
    .then(({rows}) => {
        return rows[0];
    })
    
}

exports.deleteCommentById = (comment_id) => {
    const sqlString = `
        DELETE FROM comments WHERE comment_id = $1
        returning *;
    `;

    return db.query(sqlString, [comment_id])
    .then((data) => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, message: "Opps, comment does not exist" })
        }
        return data
    })

}
