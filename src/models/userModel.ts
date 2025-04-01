import db from '../db/database';
import { faker } from '@faker-js/faker';
import bcrypt from "bcryptjs";
import { ResultSetHeader } from 'mysql2';

class User {
    static async getUsers() {
        const query = 'SELECT id, name, email, phone, role FROM users';
        const [rows] = await db.query<ResultSetHeader[] & UserType[]>(query);
        return rows;
    }
    static async getUsersFull() {
        const query = `SELECT * FROM users`;
        const [rows] = await db.query<ResultSetHeader[] & UserType[]>(query);
        return rows;
    }
    static async getUserById(id:string) {
        const query = `SELECT * FROM users WHERE id = ?`;
        const [rows] = await db.query<ResultSetHeader[] & UserType[]>(query, [id]);
        return rows;
    }
    static async getUserByMail(mail:string){
        const query = `SELECT * FROM users WHERE email = ?`;
        const [rows] = await db.query<ResultSetHeader[] & UserType[]>(query, [mail]);
        return rows[0];
    }
    static async getUserSessionData(id:string){
        const query = `SELECT id, name, email, phone, handle, role FROM users WHERE ID = ?`;
        const [row] = await db.query<ResultSetHeader[]>(query, [id]);
        return row[0]; //Fix this thing
    }
    static async createUser(name: string, email?: string, password?: string, phone?: string, handle?: string) {
        const query = `INSERT INTO users (name, email, password, phone, handle) VALUES (?, ?, ?, ?, ?)`;
        const values = [
        name,
        email || faker.internet.email(),
        bcrypt.hashSync(password || "password", 1),
        phone || faker.phone.number({ style: 'international' }),
        handle || name.toLowerCase().replace(" ","_").slice(0,16)
        ];
        try{
            await db.query(query, values);
        }catch(error){
            console.error(error);
            throw Error(`Error creating user`);
        }
    }
    static async updateUser(id: string, name?: string, email?: string, phone?: string, role?: string){
        const fields: string[] = [];
        const values: string[] = [];
        const data = { name, email, phone, role };
        if(name){
            fields.push(`name = ?`);
            values.push(name);
        }
        if(email){
            fields.push(`email = ?`);
            values.push(email);
        }
        if(phone){
            fields.push(`phone = ?`);
            values.push(phone);
        }
        if(role){
            fields.push(`role = ?`);
            values.push(role);
        }
        const t_fields = fields.join(", ");
        const query = `UPDATE users SET ${t_fields} WHERE id = ?`;
        try{
            await db.query(query,[...values,id]);
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
