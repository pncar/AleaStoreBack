import db from '../db/database';
import { faker } from '@faker-js/faker';
import { Request, Response } from 'express';

class Category {
    static async getCategories(){
        const query = 'SELECT * FROM categories';
        const [rows] = await db.query(query);
        return rows;
    }
    static async getCategoryById(id:string){
        const query = `SELECT * FROM categories WHERE id = ?`;
        const [rows] = await db.query(query,id);
        return rows;
    }
}

export default Category;

/*
OLD WAY TO GET DESCEDNANTS

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
*/