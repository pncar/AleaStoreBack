import { Request, Response } from 'express';
import db from '../db/database';

export const getProducts = async (req: Request, res: Response) => {
  try {
    const query = 'SELECT * FROM products';
    const [rows] = await db.query(query);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching products');
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const query = `SELECT * FROM products WHERE id = ?`;
    const [rows] = await db.query(query, [id]);
    res.status(200).json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching product');
  }
};