const { Connection } = require("../connection/mysql_connection");

const MessageDao = {
    insert: (message) => {
        let statement = `INSERT INTO tbl_message(sender, message)
            VALUES('${message.sender.id}', ${message.message}')`;

        console.log("statement: ", statement);

        Connection.query(statement, function(err, result, fields) {
            if (err) throw err;
          
            console.log(result.insertId);
        });
    },

    getAllByGroup: (param = {group: 0, search: "", page: 1, size: 10}, callback) => {
        let query = `SELECT * 
            FROM tbl_message 
            WHERE group_id = ${param.group}
                AND message LIKE '%${search}%'
            LIMIT ${param.size} OFFSET ${(param.page - 1) * param.size}`;

        Connection.query(query, function (err, result) {
            if (err) throw err;
            callback(result);
        });


    }
};

module.exports = { MessageDao };