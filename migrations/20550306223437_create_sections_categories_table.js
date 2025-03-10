/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('sections_categories', function(table) {
        table.integer('section_id').unsigned().references('id').inTable('sections').onDelete('CASCADE');
        table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('CASCADE');
        table.primary(['section_id', 'category_id']);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('sections_categories'); 
};
