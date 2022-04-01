const { Connection } = require("../connection/mysql_connection");
const User = require("../model/user");
const { query } = require("./query");

const UserDao = {
    insert: async (user) => {
        let statement = `INSERT INTO tbl_user(name, email, password)
            VALUES(?, ?, ?)`;

        await query(statement, [user.name, user.email, user.password])
            .then((result) => result.insertId)
            .catch(err => console.log(err));
        
    },

    getById: async (id) => {
        let statement = `SELECT *
            FROM tbl_user
            where id = ?`;

        let user = null;
        await query(statement, id)
            .then((result) => {
                if(result.length > 0) user = new User(result[0].id, result[0].name, result[0].email, result[0].password)
            })
            .catch(err => console.log(err));
        return user;
    },

    getByEmail: async (email) => {
        let statement = `SELECT *
            FROM tbl_user
            where email = ?`;

        let user = null;
        await query(statement, email)
            .then((result) => {
                if(result.length > 0) user = new User(result[0].id, result[0].name, result[0].email, result[0].password)
            })
            .catch(err => console.log(err));
        return user;
    },

    searchByName: async (name) => {
        let statement = `SELECT *
            FROM tbl_user
            where name like '%${name}%'`;

        let users = [];
        await query(statement)
            .then((results) => {
                for(let i=0; i<results.length; i++) {
                    users.push(new User(results[i].id, results[i].name, results[i].email, results[i].password));
                }
            })
            .catch(err => console.log(err));
        return users;
    },

    getUserByGroupId: async (id_group) => {
        let statement = `SELECT *
            FROM tbl_user
                INNER JOIN tbl_user_group
                ON tbl_user.id = tbl_user_group.id_user
            WHERE tbl_user_group.id_group = ?`
        let users = [];
        await query(statement, [id_group])
            .then((results) => {
                for(let i=0; i<results.length; i++) {
                    users.push(new User(results[i].id_user, results[i].name, results[i].email));
                }
            })
            .catch(err => console.log(err));
        return users;
    }
};

module.exports = { UserDao };