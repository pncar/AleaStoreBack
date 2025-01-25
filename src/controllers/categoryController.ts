import { Request, Response } from 'express';
import Category from "../models/categoryModel";

export const getCategories = async (req: Request, res: Response) => {
    try {
      const categories = await Category.getCategories();
      res.status(200).json(categories);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching categories');
    }
};

export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try{
    const category = await Category.getCategoryById(id);
    //@ts-ignore
    res.status(200).json(category);
  }
  catch (error){
    console.error(error);
    res.status(500).send('Error fetching category');
  }
}
