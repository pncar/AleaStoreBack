/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('discounts', function(table) {
        table.increments('id').primary();
        table.enu('type', ['discount']).notNullable(); 
        table.integer('rate',2).notNullable();
        table.string("name").notNullable().defaultTo("Discount").unique();
        table.timestamps(true, true);  
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('discounts'); 
};
