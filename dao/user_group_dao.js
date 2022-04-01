const { Connection } = require("../connection/mysql_connection");
const Group = require("../model/group");
const { query } = require("./query");

const UserGroupDao = {
    updateSeen: async (idUser, idGroup) => {
        let statement = `UPDATE tbl_user_group
            SET tbl_user_group.seen = true
            WHERE tbl_user_group.id_user = ?
                AND tbl_user_group.id_group = ?`;

        await query(statement, [idUser, idGroup])
            .catch(err => console.log(err));
    },

    updateNotSeenAll: async (idGroup) => {
        let statement = `UPDATE tbl_user_group
            SET tbl_user_group.seen = false
            WHERE tbl_user_group.id_group = ?`;

        await query(statement, [idGroup])
            .catch(err => console.log(err));
    }
};

module.exports = { UserGroupDao };