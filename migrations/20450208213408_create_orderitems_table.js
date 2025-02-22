/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.createTable('orderitems', function(table) {
        table.increments('id').primary(); 
        table.integer('order_id').unsigned().notNullable().references('id').inTable('orders').onDelete('CASCADE');  
        table.integer('product_id').unsigned().notNullable().references('id').inTable('products').onDelete('CASCADE');
        table.integer('quantity').notNullable().defaultTo(1);
        //table.integer('price').notNullable();
        table.timestamps(true, true);  
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function(knex) {
    return knex.schema.dropTableIfExists('orderitems');
};
