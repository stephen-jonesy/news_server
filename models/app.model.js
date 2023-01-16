const db = require('../db/connection')

exports.selectTopics = () => {
    const sqlString = `
        SELECT * FROM topics;
    `
    return db.query(sqlString);
}

exports.selectCommentsByArticleId = (articleId) => {
    console.log(articleId);
    const sqlString = `
        SELECT * FROM comments
        where comments.article_id = $1;
    `

    return db.query(sqlString,[articleId])
    .then((data)=> {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, message: "Opps, no comments found" })

        }
        return data;
    })
}