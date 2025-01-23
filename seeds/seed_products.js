/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const faker = require('@faker-js/faker').faker;

const categories = [
    {id: 1, name: "HDD", description : "", parent: 9},
    {id: 2, name: "SSD", description: "", parent: 9},
    {id: 3, name: "GFX", description: "", parent: 9},
    {id: 4, name: "RAM", description: "", parent: 9},
    {id: 5, name: "CPU", description: "", parent: 9},
    {id: 6, name: "Monitor", description: "", parent: 9},
    {id: 7, name: "Mouse", description: "", parent: 9},
    {id: 8, name: "Keyboard", description: "", parent: 9},
    {id: 9, name: "Technology", description: ""},
    {id: 10, name: "Phones & Tablets", description: ""},
    {id: 11, name: "Phones", description: "", parent: 9},
    {id: 12, name: "Android", description: "", parent: 10}
];

exports.seed = async function(knex) {

  // Deletes ALL existing entries
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('users').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
  for(let i=0;i<50;i++){
      const name = faker.person.fullName();
      const phone = faker.phone.number({ style: 'international' });
      const email = faker.internet.email();
      await knex.raw(`INSERT INTO users (name, email, phone) VALUES (?,?,?)`,[name,email,phone]);
  }

  await knex('categories').del();
  await knex.raw('ALTER TABLE categories AUTO_INCREMENT = 0');
  for(const category of categories){
    const args = [];
    args[0] = category.id;
    args[1] = category.name;
    args[2] = category.description;
    if(category.parent){
      args[3] = category.parent;
    }
    await knex.raw(`INSERT INTO categories (id, name, description ${category.parent ? ", parent" : ""}) VALUES (?,?,?${category.parent ? ",?" : ""})`,args);
  }

  await knex('products').truncate();
  for(let i=0;i<50;i++){
      const name = faker.lorem.word();
      const identifier = faker.string.alpha(8);
      const description = faker.lorem.paragraph(2);
      const category = faker.number.int({min: 1, max:8});
      const user = faker.number.int({min: 1, max:50});
      await knex.raw(`INSERT INTO products (name, identifier, description, category_id, user_id) VALUES (?,?,?,?,?)`,[name,identifier,description,category,user]);
  }
};
