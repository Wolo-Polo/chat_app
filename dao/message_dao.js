const { Connection } = require("../connection/mysql_connection");
const Message = require("../model/message");
const { query } = require("./query");

const MessageDao = {
    insert: async (message) => {
        let statement = `INSERT INTO tbl_message(id_sender, id_group, message)
            VALUES(?, ?, ?)`;

        await query(statement, [message.id_sender, message.id_group, message.message])
            .then((result) => result.insertId)
            .catch(err => console.log(err));
    },

    getAllByGroup: async (/*param = {group: 0, search: "", page: 1, size: 10}*/  group_id) => {
        let statement = `SELECT * 
            FROM tbl_message 
            WHERE id_group = ?
            ORDER BY created_at ASC`;

        let messages = [];
        await query(statement, group_id)
            .then(results => {
                for(let i=0; i<results.length; i++) {
                    messages.push(new Message(results[i].id, results[i].id_sender, results[i].id_group,
                        results[i].message, results[i].created_at, results[i].modified_at));
                }
            })
            .catch(err => console.log(err));
        return messages;
    }
};

module.exports = { MessageDao };