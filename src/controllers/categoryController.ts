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

export const getCategoriesByTier = async (req: Request, res: Response) => {
  const { tier } = req.params;
    try{
      const categories = await Category.getCategoriesByTier(tier);
      res.status(200).json(categories);
    }catch (error){
      console.error(error);
      res.status(500).send(`Error fetching categories of tier ${tier}`);
    }
}

export const getCategoriesByProduct = async (req: Request, res: Response) => {
  const { productId } = req.params;
  try{
    const categories = await Category.getCategoriesByProduct(productId);
    res.status(200).json(categories);
  }catch(error){
    console.error(error);
    res.status(500).send(`Error fetching categories of product ${productId}`);
  }
}

export const getChildrenCategories = async (req: Request, res: Response) => {
  const { parent } = req.params;
  try{
    const categories = await Category.getChildrenCategories(parent);
    res.status(200).json(categories);
  }catch(error){
    console.error(error);
    res.status(500).send(`Error fetching categories of parent ${parent}`);
  }
}

export const getCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try{
    const category = await Category.getCategoryById(id);
    res.status(200).json(category);
  }
  catch (error){
    console.error(error);
    res.status(500).send('Error fetching category');
  }
}

export const createCategory = async (req: Request, res: Response) => {
  const { name, parent } = req.body;
  try{
    const category = await Category.createCategory(name,parent);
    res.status(200).send({message: `Category ${name} of id ${category.insertId} successfully created.`, insertId: category.insertId});
  }catch (error){
    console.error(error);
    res.status(500).send({message: `Category ${name} couldn't be created.`});
  }
}

export const updateCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name } = req.body;
  try{
    await Category.updateCategory(id,name);
    res.status(200).send({message: `Category was successfully updated.`});
  }catch(error){
    console.error(error);
    res.status(500).send({message: `Category couldn't be updated.`});
  }
}

export const deleteCategory = async (req: Request, res: Response) => {
  const { id } = req.params;
  try{
    await Category.deleteCategory(id);
    res.status(200).send({message: `Category ${id} deleted successfully.`});
  }catch(error){
    console.error(error);
    res.status(500).send({message: `Category ${id} coudln't be deleted.`})
  }
}
