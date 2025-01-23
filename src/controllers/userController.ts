import { Request, Response } from 'express';
import db from '../db/database';
import { faker } from '@faker-js/faker';
import { getUsers2 } from "../models/userModel";

    export const getUsers = async (req: Request, res: Response) => {
        try {
        //const query = 'SELECT * FROM users';
        //const [rows] = await db.query(query);
        const rows = await getUsers2();
        res.status(200).json(rows);
        } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching users');
        }
    };
    
    export const getUserById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const query = `SELECT * FROM users WHERE id = ?`;
            const [rows] = await db.query(query, [id]);
            res.status(200).json(rows);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching user');
        }
    };
    
    export const createUser = async (req: Request, res: Response) => {
        const { name, email, phone } = req.query;
        try {
            const query = `INSERT INTO users (name, email, phone) VALUES (?, ?, ?)`;
            const values = [
            name,
            email || faker.internet.email(),
            phone || faker.phone.number({ style: 'international' }),
            ];
            await db.query(query, values);
            res.status(200).send('User created successfully');
        } catch (error) {
            console.error(error);
            res.status(500).send('Error creating user');
        }
    };

    export const updateUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        const { name, email, phone } = req.query || {};
        try{
            const fields: string[] = [];
            Object.keys(req.query).map((item: string) =>{
                fields.push(`${item} = ?`);
            });
            const t_fields = fields.join(", ");
            const query = `UPDATE users SET ${t_fields} WHERE id = ?`;
            await db.query(query,[...Object.values(req.query),id]);
            console.log(t_fields);
            res.status(200).send(query);
        }catch (error) {    
            console.error(error);
            res.status(500).send('Error updating user');
        }
    }

    export const deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        try{
            const query = `DELETE FROM users WHERE id = ?`;
            await db.query(query,[id]);
            res.status(200).send(`User with id ${id} was deleted.`);
        }catch( error ){
            console.error(error);
            res.status(500).send(`Error deleting user`);
        }
    }