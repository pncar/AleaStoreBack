/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('users', function(table) {
    table.increments('id').primary();  // Auto-incrementing primary key
    table.string('name').notNullable();  // Non-nullable 'name' column
    table.string('email').notNullable().unique();  // Non-nullable 'email' column with a unique constraint
    table.string('phone').notNullable();
    table.timestamps(true, true);  // Created_at and updated_at timestamps
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('users');  // Drop the 'users' table if it exists
};
