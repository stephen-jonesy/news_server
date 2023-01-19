const db = require('../db/connection')

exports.selectArticles = ({topic, sort_by, order}) => {

    const queryValues = [];

    const validSortBys = ['title', 'topic', 'author', 'body', 'created_at', 'article_img_url'];

    const validOrderBys = ['asc', 'desc'];

    let sqlString = `
        SELECT articles.*, COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
    `;

    if(topic) {

        sqlString += `HAVING topic = $1 `;
        queryValues.push(topic);
    }

    if (sort_by && !validSortBys.includes(sort_by)) {
        return Promise.reject({ status: 400, message: 'Invalid sort query' });
    }

    if (order && !validOrderBys.includes(order)) {
        return Promise.reject({ status: 400, message: 'Invalid order query' });
    }

    sqlString += `ORDER BY ${sort_by === undefined ? 'created_at' : sort_by} ${order === undefined ? 'DESC' : order};`;

    return db.query(sqlString, queryValues)
    .then((data) => {
        if (!data.rows.length) {
            if (topic) {
                return data;
            }
            return Promise.reject({ status: 404, message: "No articles exist" });
        }
        return data;

    })

}

exports.selectArticleById = (articleId) => {

    const sqlString = `
        SELECT articles.*, COUNT(comments.article_id) AS comment_count 
        FROM articles
        LEFT JOIN comments
        ON articles.article_id = comments.article_id
        GROUP BY articles.article_id
        HAVING articles.article_id = $1;
        
    `;

    return db.query(sqlString, [articleId])
    .then((data) => {
        if (!data.rows.length) {
            return Promise.reject({ status: 404, message: "Opps, article does not exist" })
        }
        return data;

    })
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