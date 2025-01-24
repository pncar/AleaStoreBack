import db from '../db/database';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';

class Product {
    static async getProducts(){
        const query = 'SELECT * FROM products';
        const [rows] = await db.query(query);
        return rows;
    }
    static async getProductById(id:string){
        const query = `SELECT * FROM products WHERE id = ?`;
        const [rows] = await db.query(query, [id]);
        return rows;
    }
}

export default Product;