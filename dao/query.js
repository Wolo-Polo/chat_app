const { Connection } = require("../connection/mysql_connection");

async function query(sql, params) {
    return new Promise((resolve, reject) => {
        Connection.query(sql, params, (error, results) => {
            // console.log(sql, params);
            // console.log(error, results);
            if(error) reject(error);
            return resolve(results);
        })
    });
}

module.exports = { query };