const db = require('../db/connection')

exports.selectTopics = () => {
    const queryValues = [];

    const sqlString = `
        SELECT * FROM topics;
    `
    return db.query(sqlString);
}

exports.selectArticles = ({topic, sort_by, order}) => {
    const queryValues = [];

    let sqlString = `
        SELECT articles.*, COUNT(comments.article_id) as comment_count 
        FROM articles
        JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
    `;

    if(topic) {

        sqlString += `HAVING topic = $1 `;
        queryValues.push(topic);
    }

    if (sort_by && !['title', 'topic', 'author', 'body', 'created_at', 'article_img_url'].includes(sort_by)) {
        return Promise.reject({ status: 400, message: 'Invalid sort query' });
    }

    if (order && !['asc', 'desc'].includes(order)) {
        return Promise.reject({ status: 400, message: 'Invalid order query' });
    }

    sqlString += `ORDER BY ${sort_by === undefined ? 'created_at' : sort_by} ${order === undefined ? 'DESC' : order};`;

    return db.query(sqlString, queryValues)
    .then((data) => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, message: "Article doesn\'t exist" });
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

exports.selectUsers = () => {

    const sqlString = `
        SELECT * FROM users;
    `
    return db.query(sqlString);

}


