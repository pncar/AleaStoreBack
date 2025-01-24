import db from '../db/database';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';

class User {
    static async getUsers() {
        const query = 'SELECT * FROM users';
        const [rows] = await db.query(query);
        return rows;
    }
    static async getUserById(id:string) {
        const query = `SELECT * FROM users WHERE id = ?`;
        const [rows] = await db.query(query, [id]);
        return rows;
    }
    static async createUser(req: Request) {
        const { name, email, phone } = req.query;
        const query = `INSERT INTO users (name, email, phone) VALUES (?, ?, ?)`;
        const values = [
        name,
        email || faker.internet.email(),
        phone || faker.phone.number({ style: 'international' }),
        ];
        try{
            await db.query(query, values);
        }catch(error){
            throw Error("Error inserting data");
        }
    }
    static async updateUser(id: string, req: Request){
        const fields: string[] = [];
        Object.keys(req.query).map((item: string) =>{
            fields.push(`${item} = ?`);
        });
        const t_fields = fields.join(", ");
        const query = `UPDATE users SET ${t_fields} WHERE id = ?`;
        console.log(t_fields);
        try{
            await db.query(query,[...Object.values(req.query),id]);
            return query;
        }catch(error){
            throw Error("Error updating user");
        }
    }
    static async deleteUser(id: string){
        try{
            const query = `DELETE FROM users WHERE id = ?`;
            await db.query(query,[id]);
        }catch(error){
            throw Error (`Failed at deleting user ${id}`);
        }
    }
}

export default User;
