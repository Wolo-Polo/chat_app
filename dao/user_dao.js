const { Connection } = require("../connection/mysql_connection");

const UserDao = {
    insert: (user) => {
        let statement = `INSERT INTO tbl_user(name, email, password)
            VALUES('${user.name}', ${user.email}, '${user.password}')`;

        console.log("statement: ", statement);

        Connection.query(statement, function (err) {
            if (err) throw err;
            console.log("Inserted");
          });
    },

    getById: (callback) => {
        let query = `SELECT *
            FROM tbl_user
            where id = ${id}`;
        Connection.query(query, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    },

    getByEmail: (callback) => {
        let query = `SELECT *
            FROM tbl_user
            where email = ${email}`;
        Connection.query(query, (err, result) => {
            if (err) throw err;
            callback(result);
        });
    }

};

module.exports = { UserDao };