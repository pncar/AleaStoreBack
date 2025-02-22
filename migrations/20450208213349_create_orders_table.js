/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('orders', function(table) {
        table.increments('id').primary();  
        table.integer('user_id').unsigned().notNullable().references('id').inTable('users').onDelete('CASCADE');
        //table.integer('total').defaultTo(0);
        table.enu('status',['pending','cancelled','paid','refunded']).notNullable().defaultTo('pending');
        table.timestamps(true, true);
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('orders');
};
