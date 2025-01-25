/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('products_categories', function(table) {
        table.integer('product_id').unsigned().references('id').inTable('products');
        table.integer('category_id').unsigned().references('id').inTable('categories');
        table.primary(['product_id', 'category_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('products_categories'); 
};
