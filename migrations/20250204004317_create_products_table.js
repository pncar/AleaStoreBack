/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
  return knex.schema.createTable('products', function(table) {
    table.increments('id').primary();
    table.string('name', 255).notNullable(); 
    table.string('identifier', 8).notNullable().unique();
    table.text('description');
    table.timestamps(true, true);  
    table.string('image',255).defaultTo(null);
    table.integer('base_id').defaultTo(0).notNullable(); // This is only used on migrating/seeding
    //table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL');
    //table.integer('user_id').unsigned().references('id').inTable('users').onDelete('SET NULL');
    table.integer('price').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
  return knex.schema.dropTableIfExists('products'); 
};
