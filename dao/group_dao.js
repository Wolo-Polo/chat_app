const Group = require("../model/group");
const { query } = require("./query");

const GroupDao = {
    insert: async (group) => {
        let statement = `INSERT INTO tbl_group(name)
            VALUES(?)`;

        let id_group; 
        await query(statement, [group.name])
            .then(async (result) => {
                id_group = result.insertId;

                let statement2 = `INSERT INTO tbl_user_group(id_user, id_group)
                    VALUES(?, ?)`;
                let params = [];
                params.push(group.details[0].id);
                params.push(result.insertId);
                
                for(let i = 1; i<group.details.length; i++) {
                    statement2 += `, (?, ?)`;
                    params.push(group.details[i].id);
                    params.push(result.insertId);
                };
                await query(statement2, params);
            })
            .catch((err) => console.log(err));
        
        return id_group;
    },

    getById: async (id) => {
        let statement = `SELECT *
            FROM tbl_group
            WHERE id = ?`;
        let group = null;
        await query(statement, [id])
            .then((results) => {
                if(results.length > 0){
                    group = new Group(results[0].id, results[0].name, results[0].create_at, results[0].details);
                }
            })
            .catch((err) => console.log(err));
        return group;
    },

    getByUserId: async (id) => {
        let statement = `SELECT tbl_group.id, tbl_group.name, tbl_group.last_message_at, tbl_group.created_at, tbl_user_group.seen
            FROM tbl_group
            INNER JOIN tbl_user_group
            ON tbl_group.id = tbl_user_group.id_group
            WHERE tbl_user_group.id_user = ?
            ORDER BY last_message_at DESC`;
        let groups = [];
        await query(statement, [id])
            .then((results) => {
                for(let i=0; i<results.length; i++) {
                    groups.push(new Group(results[i].id, results[i].name, results[i].last_message_at, results[i]["created_at"], null, results[i].seen));
                }
                
            })
            .catch((err) => console.log(err));
        return groups;
    },

    updateLastMessageAt: async (id) => {
        let statement = `UPDATE tbl_group
        SET tbl_group.last_message_at = CURRENT_TIMESTAMP
        WHERE id = ?`;
        await query(statement, [id]);
    }
};

module.exports = { GroupDao };