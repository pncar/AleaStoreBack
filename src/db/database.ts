import mysql from 'mysql2/promise';

const db = mysql.createPool({
    host: 'localhost', // Replace with your host
    user: 'root',      // Replace with your MySQL username
    password: '', // Replace with your MySQL password
    database: 'blankproject', // Replace with your database name
  });

export default db;