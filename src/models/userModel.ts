import db from '../db/database';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';
import bcrypt from "bcryptjs";

class User {
    static async getUsers() {
        const query = 'SELECT id, name, email, phone FROM users';
        const [rows] = await db.query(query);
        return rows;
    }
    static async getUsersFull() {
        const query = `SELECT * FROM users`;
        const [rows] = await db.query(query);
        return rows;
    }
    static async getUserById(id:string) {
        const query = `SELECT * FROM users WHERE id = ?`;
        const [rows] = await db.query(query, [id]);
        return rows;
    }
    static async getUserByMail(mail:string){
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.query(query, [mail]);
        return (rows as Array<any>)[0];
    }
    static async getUserSessionData(id:string){
        const query = `SELECT id, name, email, phone, handle, role FROM users WHERE ID = ?`;
        const [row] = await db.query(query, [id]);
        return (row as any)[0]; //Fix this thing
    }
    static async createUser(req: Request) {
        const { name, email, password, phone, handle } = req.body;
        const query = `INSERT INTO users (name, email, password, phone, handle) VALUES (?, ?, ?, ?, ?)`;
        const values = [
        name,
        email || faker.internet.email(),
        bcrypt.hashSync(password || "password", 1),
        phone || faker.phone.number({ style: 'international' }),
        handle || name.toLowerCase().replace(" ","_").slice(0,16)
        ];
        try{
            const insert = await db.query(query, values);
        }catch(error){
            console.error(error);
            throw Error(`Error creating user`);
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
