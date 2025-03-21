import db from '../db/database';
import { faker } from '@faker-js/faker';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

interface QueryOptions {
    price_gt?: number;
    price_lt?: number;
    price_eq?: number;
    subject?: string;
    categories?: string;
    limit?: number;
    offset?: number;
    order?: "l"|"o"|"pl"|"ph";
}
interface ProductCount {
    totalCount: number
}

class Product {
    static async getProducts(queryOptions?: QueryOptions){
        
        let conditions = [];
        let conditionsParams = [];

        if(queryOptions?.price_gt){
          conditions.push(`discounted_price > ?`);
          conditionsParams.push(queryOptions.price_gt);
        }
        if(queryOptions?.price_lt){
            conditions.push(`discounted_price < ?`);
            conditionsParams.push(queryOptions.price_lt);
        }
        if(queryOptions?.price_eq){
            conditions.push(`discounted_price = ?`);
            conditionsParams.push(queryOptions.price_eq);
        }
        if(queryOptions?.subject){
            conditions.push(`LOWER(name) LIKE ?`);
            conditionsParams.push(`%${queryOptions.subject.toLowerCase()}%`);
        }
        if(queryOptions?.categories && queryOptions?.categories !== "0" && !queryOptions?.categories.includes("0")){
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
                query += ` ORDER BY discounted_price DESC`;
            break;
            case "pl":
                query += ` ORDER BY discounted_price ASC`; 
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
    static async setProductCategory(productId: string,categoryId: string){
        const query = `INSERT INTO products_categories (product_id,category_id) VALUES (?,?)`;
        try{
            await db.query(query,[productId,categoryId]);
        }catch(error){
            throw Error(`Error linking product to category`);
        }
    }
    static async setProductDiscount(productId: string, discountId: string){
        const query = `INSERT INTO products_discounts (product_id,discount_id) VALUES (?,?)`;
        try{
            await db.query(query,[productId,discountId]);
        }catch(error){
            throw Error(`Error linking discount ${discountId} to product ${productId}`);
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
            const [insert] = await db.query<ResultSetHeader>(query, values);
            const nog = await insert.insertId;
            await db.query(`INSERT INTO products_categories (product_id, category_id) VALUES (?,?)`,[insert.insertId,category]);
        }catch(error){
            throw Error(`Error inserting product -> ${name}`);
        }
    }
    static async updateProduct(id: string, name?: string, price?: string, description?: string, image?: string){
        const fields: string[] = [];
        const values: string[] = [];
        if(name){
            fields.push(`name = ?`);
            values.push(name);
        }
        if(price){
            fields.push(`price = ?`);
            values.push(price);
        }
        if(description){
            fields.push(`description = ?`);
            values.push(description);
        }
        if(image){
            fields.push(`image = ?`);
            values.push(image);
        }
        const t_fields = fields.join(", ");
        try{
            const query = `UPDATE products SET ${t_fields} WHERE id = ?`;
            await db.query(query,[...values,id]);
        }catch(error){
            console.error(error);
            throw Error(`Failed at updating user`);
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
    static async removeDiscountFromProduct(productId: string, discountId: string){
        const query = `DELETE FROM products_discounts WHERE product_id = ? AND discount_id = ?`;
        try{
            await db.query(query,[productId,discountId]);
        }catch(error){
            throw Error(`Error removing discount ${discountId} on product ${productId}.`)
        }
    }
    static async removeCategoryFromProduct(productId: string, categoryId: string){
        const query = `DELETE FROM products_categories WHERE product_id = ? AND category_id = ?`;
        try{
            await db.query(query,[productId,categoryId]);
        }catch(error){
            throw Error(`Error removing cateogry ${categoryId} on product ${productId}`);
        }
    }
    static async countProducts(){
        const query = `SELECT COUNT(*) as totalCount FROM products`;
        const [[total]] = await db.query<RowDataPacket[]>(query);
        return total.totalCount;
    }
}

export default Product;