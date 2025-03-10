/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
const faker = require('@faker-js/faker').faker;
const fs = require("fs");
const { parse, stringify } = require('yaml');
const _ = require('lodash');
const bcrypt = require("bcryptjs");

const categories = JSON.parse(fs.readFileSync('seeds/categories.json', 'utf8')).categories;
const baseProducts = JSON.parse(fs.readFileSync('seeds/baseproducts.json', 'utf8')).categories;

const productsLength = 50;

exports.seed = async function(knex) {

// Seed Users

  // Deletes ALL existing entries
  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('users').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
  for(let i=0;i<50;i++){
      const name = faker.person.fullName();
      const phone = faker.phone.number({ style: 'international' });
      const password = bcrypt.hashSync("password", 1);
      const email = i > 0 ? faker.internet.email() : "user@gmail.com";
      const handle = name.toLowerCase().replace(" ","_").slice(0,16);
      const role = i <= 0 ? "admin" : (i < 5 ? "user" : "user"); // Used to be "seller" option
      await knex.raw(`INSERT INTO users (name, email, password, phone, handle, role) VALUES (?,?,?,?,?,?)`,[name,email,password,phone,handle,role]);
  }

// Seed Categories

  await knex('categories').del();
  await knex.raw('ALTER TABLE categories AUTO_INCREMENT = 0');
  for(const category of categories){
    const args = [];
    args[0] = category.id;
    args[1] = category.name;
    args[2] = category.description || "";
    args[3] = category.parent || null;
    args[4] = category.tier;
    await knex.raw(`INSERT INTO categories (id, name, description, parent, tier) VALUES (?,?,?,?,?)`,args);
  }

// Seed Products

  await knex.raw('SET FOREIGN_KEY_CHECKS = 0');
  await knex('products').truncate();
  await knex.raw('SET FOREIGN_KEY_CHECKS = 1');
  for(let i=0;i<productsLength;i++){
    const baseProduct = baseProducts[Math.floor(Math.random() * baseProducts.length)];
    const name = `${baseProduct.productName} ${_.capitalize(faker.lorem.word())}`;
    const identifier = faker.string.alpha(8);
    const description = faker.lorem.paragraph(2);
    const base_id = baseProduct.id; // FLAG not sure about this
    //const category = faker.number.int({min: 1, max:8});
    //const user = faker.number.int({min: 2, max:5});
    let price = faker.number.int({min: baseProduct.priceRange[0], max: baseProduct.priceRange[1]});
    if(price > 9){
      price = Math.round(price/10)*10;
    }
    await knex.raw(`INSERT INTO products (name, identifier, description, price, base_id) VALUES (?,?,?,?,?)`,[name,identifier,description,price,base_id]);
  }

// Attach Products to Categories 

  await knex('products_categories').truncate();
  const [products] = await knex.raw(`SELECT * FROM products`);
  for(let i=0;i<products.length;i++){
    const productId = products[i].id;
    //const categoryId = 2;
    //console.log(baseProducts.find((product)=>{return product.id === products[i].base_id}));
    const categoryId = baseProducts.find((product)=>{return product.id === products[i].base_id}).id;
    await knex.raw(`INSERT INTO products_categories (product_id, category_id) VALUES (?,?)`,[productId,categoryId]);
  }


// Create Views

  await knex.raw('DROP VIEW IF EXISTS ProductView');
  //await knex.raw(`CREATE VIEW ProductView AS SELECT p.id, p.name, p.description, p.price, p.user_id, u.handle AS user, u.name AS user_name FROM products p JOIN users u ON p.user_id = u.id`);
  //await knex.raw(`CREATE VIEW ProductView AS SELECT id, name, description, price FROM products`);
  await knex.raw(`
  CREATE VIEW ProductView AS SELECT 
  products.id, 
  products.name, 
  products.description, 
  products.price, 
  products.image, 
  products.updated_at AS date, 
  categories.name AS category, 
  COALESCE(d.rate, 0) discount_rate,
  ROUND(products.price * (1 - COALESCE(d.rate, 0) / 100)) AS discounted_price,
  categories.id AS category_id 
  FROM products
  LEFT JOIN products_categories ON products.id = products_categories.product_id 
  LEFT JOIN categories ON products_categories.category_id = categories.id
  LEFT JOIN products_discounts pd ON products.id = pd.product_id 
  LEFT JOIN discounts d ON pd.discount_id = d.id
  `);

  // Added "LEFT JOIN" on products_categories and categories to avoid not including those uncategorized

  await knex.raw('DROP VIEW IF EXISTS OrderItemsView');
  //await knex.raw('CREATE VIEW OrderItemsView AS SELECT oi.*, oi.quantity * p.price AS total, p.price FROM orderitems oi JOIN products p ON oi.product_id = p.id');
  await knex.raw(`
  CREATE VIEW OrderItemsView AS SELECT 
  oi.*, 
  oi.quantity * p.price AS total_raw, 
  p.price as price_raw, 
  oi.quantity * p.discounted_price AS total, 
  p.discounted_price as price 
  FROM orderitems oi 
  JOIN ProductView p ON oi.product_id = p.id
  `);

  await knex.raw('DROP VIEW IF EXISTS OrdersView');
  //await knex.raw('CREATE VIEW OrdersView AS SELECT o.*, SUM(oi.quantity * p.price) AS total FROM orders o JOIN orderitems oi ON o.id = oi.order_id JOIN products p ON oi.product_id = p.id GROUP BY o.id');
  await knex.raw(`
  CREATE VIEW OrdersView AS SELECT 
  o.*, SUM(oi.quantity * p.price) AS total_raw, 
  SUM(oi.quantity * p.discounted_price) AS total, 
  u.name AS user_name 
  FROM orders o 
  JOIN OrderItemsView oi ON o.id = oi.order_id 
  JOIN ProductView p ON oi.product_id = p.id 
  JOIN users u ON u.id = o.user_id 
  GROUP BY o.id
  `);

};
