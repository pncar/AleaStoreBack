/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('products_discounts', function(table) {
        table.integer('product_id').unsigned().unique().references('id').inTable('products').onDelete('CASCADE');
        table.integer('discount_id').unsigned().references('id').inTable('discounts').onDelete('CASCADE');
        table.primary(['product_id', 'discount_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('products_discounts'); 
};
