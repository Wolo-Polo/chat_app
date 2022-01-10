const mysql = require("mysql");
const { DB_CONFIG } = require("../constant/constant");

const connection = () => {
    const connection = mysql.createConnection(DB_CONFIG)
    connection.connect((err) => {
        if(err) throw err;
        console.log("connected!")
    });

    return connection;
}


module.exports = { Connection: connection() };