const db = require('../db/connection')

exports.selectCommentsByArticleId = (articleId) => {
    const sqlComments = `
        SELECT * FROM comments
        where comments.article_id = $1
        ORDER BY created_at DESC;
    `;
    console.log('model');

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

exports.deleteCommentById = (comment_id) => {
    console.log(comment_id, '<< in model');
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
