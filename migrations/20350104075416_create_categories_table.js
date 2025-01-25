/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('categories', function(table) {
        table.increments('id').primary(); 
        table.string('name').notNullable(); 
        table.string('description');
        table.integer('parent');
        table.timestamps(true, true); 
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('categories'); 
};
