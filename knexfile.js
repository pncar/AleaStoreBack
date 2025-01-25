module.exports = {
  client: 'mysql2',  // Use MySQL2 as the client
  connection: {
    host: '127.0.0.1',  // Replace with your MySQL host
    user: 'root',  // Replace with your database user
    password: '',  // Replace with your database password
    database: 'blankproject'  // Replace with your database name
  },
  migrations: {
    tableName: 'knex_migrations', // The table for tracking migrations,
	timestamp: false
  },
  seeds: {
    directory: './seeds'  // The folder where seed files will be stored
  }
};