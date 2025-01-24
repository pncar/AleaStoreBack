import { Request, Response } from 'express';
import User from "../models/userModel";

    export const getUsers = async (req: Request, res: Response) => {
        try {
        const users = await User.getUsers();
        res.status(200).json(users);
        } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching users');
        }
    };
    
    export const getUserById = async (req: Request, res: Response) => {
        const { id } = req.params;
        try {
            const user = await User.getUserById(id);
            res.status(200).json(user);
        } catch (error) {
            console.error(error);
            res.status(500).send('Error fetching user');
        }
    };
    
    export const createUser = async (req: Request, res: Response) => {
        const { name, email, phone } = req.query;
        try {
            await User.createUser(req);
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
            const query = await User.updateUser(id, req);
            res.status(200).send(query);
        }catch (error) {    
            console.error(error);
            res.status(500).send('Error updating user');
        }
    }

    export const deleteUser = async (req: Request, res: Response) => {
        const { id } = req.params;
        try{
            await User.deleteUser(id);
            res.status(200).send(`User with id ${id} was deleted.`);
        }catch( error ){
            console.error(error);
            res.status(500).send(`Error deleting user`);
        }
    }