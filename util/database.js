const mysql = require('mysql2');

const pool = mysql.createPool ({
    host: 'localhost',
    user: 'root',
    database: 'kushkella',
    password: '',
});

module.exports = pool.promise();