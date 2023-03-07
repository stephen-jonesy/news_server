const db = require("../db/connection");

exports.selectTopics = () => {
  const sqlString = `
        SELECT * FROM topics
ç    `;
  return db.query(sqlString).then(({ rows }) => {
    return rows;
  });
};
