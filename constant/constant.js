require('dotenv').config();
console.log(process.env.HOST);

const DB_CONFIG = {
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER_NAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
};
module.exports = { DB_CONFIG };