import { Request, Response } from 'express';
import db from '../db/database';

export const getCategories = async (req: Request, res: Response) => {
    try {
      const query = 'SELECT * FROM categories';
      const [rows] = await db.query(query);
      res.status(200).json(rows);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching categories');
    }
};

export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try{
    const query = `SELECT * FROM categories WHERE id = ?`;
    const [rows] = await db.query(query,id);

    const getTree = async () => {
      const [rows] = await db.query(`SELECT * FROM categories WHERE parent = ${id}`);
      return rows;
    }

    const sneed = await getTree();

    //@ts-ignore
    res.status(200).json([...rows,...sneed]);
  }
  catch (error){
    console.error(error);
    res.status(500).send('Error fetching category');
  }
}

export const setParent = async (req: Request, res: Response) => {
  const { child, parent } = req.query || {};
  try{
    const query = `UPDATE categories SET parent_id = ? WHERE id = ?`;
    await db.query(query,[child,parent]);
    res.status(200).json(`Category X was assigned to parent Y`);
  }catch (error) {
    console.error(error);
    res.status(500).send('Error assigning parent categories');
  }
}
