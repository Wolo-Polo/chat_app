require('dotenv').config();
//console.log(process.env.HOST);

const DB_CONFIG = {
    host: 'localhost',
    port: 3336,
    user: 'chat_app',
    password: 'Password123',
    database: 'chat_app',
};
module.exports = { DB_CONFIG };