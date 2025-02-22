import db from '../db/database';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';

class Order {
    static async getOrders(){
        //const query = 'SELECT * FROM products';
        const query = `SELECT * FROM OrdersView`;
        const [rows] = await db.query(query);
        const rowsWithItems = await Promise.all((rows as any).map(async(row:any)=>{
            const query = `SELECT orderitems.id, orderitems.quantity, products.price, products.name FROM orderitems LEFT JOIN products ON orderitems.product_id = products.id WHERE order_id = ?;`
            const [items] = await db.query(query,[row.id]);
            return {...(row as any),items}
    }));
        return rowsWithItems;
    }
    static async getOrderById(id:string){
        const query = `SELECT * FROM OrdersView WHERE id = ?`;
        let [rows] = await db.query(query, [id]);
        const itemsQuery = `SELECT * FROM orderitems WHERE order_id = ?`;
        const [items] = await db.query(itemsQuery,[id]);
        return {...(rows as any)[0],items};
    }
    static async getOrdersByUser(id: string, role: string = "user"){
        const query = `SELECT * FROM OrdersView WHERE user_id = ? ${role === "user" ? ` AND status <> 'paid' AND status <> 'cancelled' ` : ``}`;
        console.log(query);
        const [rows] = await db.query(query,[id]);
        const rowsWithItems = await Promise.all((rows as any).map(async(row:any)=>{
                const query = `SELECT orderitems.id, orderitems.quantity, products.price, products.name FROM orderitems LEFT JOIN products ON orderitems.product_id = products.id WHERE order_id = ?;`
                const [items] = await db.query(query,[row.id]);
                return {...(row as any),items}
        }));
        return rowsWithItems;
    }
    static async createOrder(userId: string, list: {id:string,q:string}[]){
        const identifier = faker.string.alpha(8);
        const query = `INSERT INTO orders (user_id) VALUES (?)`;
        const values = [userId];
        try{
            const [insert] = await db.query(query, values);
            //const nog = await (insert as any).insertId;
            for(const item of list){
                // Note: Price should not be there, it should automatically get the item price, I think same with total
                console.log(`INSERT INTO orderitems (order_id, product_id, quantity) VALUES (${(insert as any).insertId}, ${item.id}, ${item.q})`);
                await db.query(`INSERT INTO orderitems(order_id, product_id, quantity) VALUES (?,?,?)`,[(insert as any).insertId,item.id,item.q]);
            }
        }catch(error){
            console.log(error);
            throw Error(`Error inserting order for user ${userId}`);
        }
    }
    static async updateOrderStatus(id: string, status:string ){
        const query = `UPDATE orders SET status = ? WHERE id = ?`;
        try{
            const [rows] = await db.query(query,[status,id]);
            return rows;
        }catch(error){
            throw Error(`Failed at updating Order ${id}`);
        }
    }
    static async deleteOrder(id: string){
        try{
            const query = `DELETE FROM orders WHERE id = ?`;
            await db.query(query,[id]);
        }catch(error){
            console.log(error);
            throw Error(`Failed at deleting order ${id}`);
        }
    }
}

export default Order;