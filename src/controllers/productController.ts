import { Request, Response } from 'express';
import Product from "../models/productModel";

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.getProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching products');
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.getProductById(id);
    res.status(200).json(product);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching product');
  }
};