import db from '../db/database';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';

interface QueryOptions {
    price_gt?: number;
    price_lt?: number;
    price_eq?: number;
    name?: string;
    categories?: number[];
    limit?: number;
    offset?: number;
    order?: "l"|"o"|"pl"|"ph";
}

class Product {
    static async getProducts(queryOptions?: QueryOptions){
        
        let conditions = [];
        let conditionsParams = [];

        if(queryOptions?.price_gt){
          conditions.push(`price > ?`);
          conditionsParams.push(queryOptions.price_gt);
        }
        if(queryOptions?.price_lt){
            conditions.push(`price < ?`);
            conditionsParams.push(queryOptions.price_lt);
        }
        if(queryOptions?.price_eq){
            conditions.push(`price = ?`);
            conditionsParams.push(queryOptions.price_eq);
        }
        if(queryOptions?.name){
            conditions.push(`LOWER(name) LIKE ?`);
            conditionsParams.push(`%${queryOptions.name.toLowerCase()}%`);
        }
        if(queryOptions?.categories){
            conditions.push(`category_id IN (?)`);
            conditionsParams.push(queryOptions.categories);
        }

        let query = `SELECT * FROM ProductView`;
        let countQuery  = `SELECT COUNT(*) as totalCount FROM ProductView`;

        if(conditions.length > 0 ){
            query += ' WHERE ' + conditions.join(' AND ');
            countQuery += ' WHERE ' + conditions.join(' AND ');
        }

        switch(queryOptions?.order){
            case "ph":
                query += ` ORDER BY price DESC`;
            break;
            case "pl":
                query += ` ORDER BY price ASC`; 
            break;
            case "o":
                query += ` ORDER BY date ASC`;
            break;
            case "l":
            default:
                query += ` ORDER BY date DESC`;
            break;
        }

        if(queryOptions?.limit){
            query += ` LIMIT ? OFFSET ?`;
            conditionsParams.push(Number(queryOptions.limit),Number(queryOptions.offset)||0);
        }

        const [rows] = await db.query(query,conditionsParams);
        const [count] = await db.query(countQuery,conditionsParams);


        return {products:rows,count:count};
    }
    static async getProductById(id:string){
        const query = `SELECT * FROM ProductView WHERE id = ?`;
        const [rows] = await db.query(query, [id]);
        return rows;
    }
    static async setProductCategory(productId: number,categoryId: number){
        const query = `INSERT INTO products_categories (product_id,category_id) VALUES (?,?)`;
        try{
            await db.query(query,[productId,categoryId]);
        }catch(error){
            throw Error(`Error linking product to category`);
        }
    }
    static async createProduct(name: string, description: string, price: string, category: string, image?: string){
        //const { name, description, price, userId, category } = req.body;
        console.log(`Trying to insert:`);
        console.log({name,description,price,category});
        const identifier = faker.string.alpha(8);
        const query = `INSERT INTO products (name, description, price, identifier, image) VALUES (?, ?, ?, ?, ?)`;
        const values = [name,description,price,identifier,image];
        try{
            const [insert] = await db.query(query, values);
            const nog = await (insert as any).insertId;
            await db.query(`INSERT INTO products_categories (product_id, category_id) VALUES (?,?)`,[(insert as any).insertId,category]);
        }catch(error){
            throw Error(`Error inserting product -> ${name}`);
        }
    }
    static async deleteProduct(id: string){
        try{
            const query = `DELETE FROM products WHERE id = ?`;
            await db.query(query,[id]);
        }catch(error){
            console.log(error);
            throw Error(`Failed at deleting product ${id}`);
        }
    }
    static async countProducts(){
        const query = `SELECT COUNT(*) as totalCount FROM products`;
        const [total] = await db.query(query);
        return total;
    }
}

export default Product;