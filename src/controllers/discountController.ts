import { Request, Response } from 'express';
import Discount from "../models/discountModel";

export const getDiscounts = async (req: Request, res: Response) => {
    try {
        const discounts = await Discount.getDiscounts();
        res.status(200).json(discounts);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error fetching discounts');
    }
};
export const getDiscountById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
        const [discount] = await Discount.getDiscountById(id);
        if(!discount){
            res.status(404).json({message: `Discount of id ${id} not found.`})
        }
        res.status(200).json(discount)
    }catch (error){
        console.error(error);
        res.status(500).send(`Error fetching discount of id ${id}`);
    }
}
export const getDiscountByProduct = async (req: Request, res: Response) => {
    const { productId } = req.params;
    try{
        const discounts = await Discount.getDiscountsByProduct(productId);
        res.status(200).json(discounts);
    }catch (error){
        console.error(error);
        res.status(500).send(`Error fetching discounts of product ${productId}.`);
    }
}
export const createDiscount = async (req: Request, res: Response) => {
    const { name, rate } = req.body;
    try {
        await Discount.createDiscount(name,rate);
        res.status(200).send('Discount created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating discount');
    }
}
export const updateDiscount = async (req: Request, res: Response) =>{
    const { id } = req.params;
    const { name, rate } = req.body;
    try{
        await Discount.updateDiscount(id,name,rate);
        res.status(200).send(`Discount ${id} updated successfully`);
    }catch(error){
        console.error(error);
        res.status(500).send(`Error deleting discount ${id}`);
    }
}
export const deleteDiscount = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        await Discount.deleteDiscount(id);
        res.status(200).send(`Discount deleted successfully`);
    }catch(error){
        console.error(error);
        res.status(500).send(`Error deleting discount`);
    }
}