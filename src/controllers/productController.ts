import { Request, Response } from 'express';
import Product from "../models/productModel";
import multer from "multer";

const upload = multer({ dest: './uploads/' });

export const getProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.getProducts(req.query);
    console.log(multer);
    res.status(200).json(products);
  } catch(error){
    console.error(error);
    res.status(500).send('Error fetching products');
  }
};

export const getProductById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const product = await Product.getProductById(id);
    res.status(200).json(product);
  } catch(error){
    console.error(error);
    res.status(500).send(`Order fetching product of id ${id}`);
  }
};

export const createProduct = async (req: Request, res: Response) => {
  const { name, description, price, category } = req.body;
  const image = req.file?.filename;
  console.log(`REQUEST FILE:`);
  console.log(req.file);
  try {
    await Product.createProduct(name,description,price,category,image);
    res.status(200).send({message: 'Product created successfully'});
  } catch (error) {
      console.error(error);
      res.status(500).send({message: 'Error creating product.'});
  }
}

export const updateProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {name, price, description} = req.body;
  const image = req.file?.filename;
  try{
    await Product.updateProduct(id,name,price,description,image);
    res.status(200).send({message: `Product updated successfully`});
  }catch(error){
    console.error(error);
    res.status(500).send({message: `Error updating product.`});
  }
}

export const deleteProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  try{
      await Product.deleteProduct(id);
      res.status(200).send(`Product with id ${id} was deleted.`);
  }catch( error ){
      console.error(error);
      res.status(500).send(`Error deleting product`);
  }
}

export const setProductDiscount = async (req: Request, res: Response) => {
  const { productId, discountId } = req.body;
  try{
    await Product.setProductDiscount(productId,discountId);
    res.status(200).send({message: `Discount ${discountId} successfully linked to Product ${productId}`});
  }catch(error){
    console.error(error);
    res.status(500).send({message: `Error linking Discount ${discountId} to Product ${productId}`});
  }
}

export const setProductCategory = async (req: Request, res: Response) => {
  const { productId, categoryId } = req.body;
    try{
      await Product.setProductCategory(productId,categoryId);
      res.status(200).json(`Product ${productId} and Category ${categoryId} were linked successfully.`);
    } catch (error){
      console.error(error);
      res.status(500).send(`Error setting product category`);
    }
}

export const removeDiscountFromProduct = async (req: Request, res: Response) => {
  const { productId, discountId } = req.body;
  try { 
    await Product.removeDiscountFromProduct(productId,discountId);
    res.status(200).send({message: `Discount ${discountId} successfully removed from product ${productId}`});
  } catch(error){
    console.error(error);
    res.status(500).send(`Error removing discount ${discountId} from product ${productId}`);
  }
}

export const removeCategoryFromProduct = async (req: Request, res: Response) => {
  const { productId, categoryId } = req.body;
  try {
    await Product.removeCategoryFromProduct(productId,categoryId);
    res.status(200).send({message: `Category ${categoryId} successfully removed from product ${productId}`});
  } catch(error){
    console.error(error);
    res.status(500).send(`Error removing category ${categoryId} from product ${productId}`);
  }
}

export const countProducts = async (req: Request, res: Response) => {
  try{
    const total = await Product.countProducts();
    res.status(200).send(total);
  }catch(error){
    console.error(error);
    res.status(500).send(`Error counting products`);
  }
}

export const uploadProductImage = async (req: Request, res: Response) => {
    if (!req.file) {
      res.status(400).send("No file uploaded");
      return;
    }
    const imageUrl = `/uploads/${req.file.filename}`;
    const product = {
      name: req.body.name,
      imageUrl,
    };
    res.status(201).send("Product uploaded successfully");
}