import { Request, Response } from 'express';
import Order from "../models/orderModel";

export const getOrders = async (req: Request, res: Response) => {
    try {
      const orders = await Order.getOrders();
      res.status(200).json(orders);
    } catch (error) {
      console.error(error);
      res.status(500).send('Error fetching orders');
    }
  };
  
  export const getOrderById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try {
      const order = await Order.getOrderById(id);
      res.status(200).json(order);
    } catch (error) {
      console.error(error);
      res.status(500).send(`Error fetching order of id ${id}`);
    }
  };

  export const getOrdersByUser = async ( req: Request, res: Response) => {
    const { id } = req.params;
    const { role } = (req as any).user || "user";
    try{
      const orders = await Order.getOrdersByUser(id, role);
      res.status(200).json(orders);
    }catch (error) {
      console.error(error);
      res.status(500).send(`Error fetching orders of user ${id}`);
    }
  }

  export const createOrder = async (req: Request, res: Response) => {
    const { userId, list } = req.body;
    if(list.length < 1){
      res.status(500).send(`Order must have at least one item`);
      return;
    }
    try {
      await Order.createOrder(userId,list);
      res.status(200).send('Order created successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error creating order');
    }
  }
  
  export const updateOrderStatus = async (req: Request, res: Response) =>{
    const { id } = req.params;
    const { value } = req.body;
    try {
      await Order.updateOrderStatus(id,value);
      res.status(200).send(`Order ${id} updated successfully with value ${value}`);
    } catch (error) {
      res.status(500).send(`Error setting value ${value} on order ${id}`);
    }
  }

  export const deleteOrder = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        await Order.deleteOrder(id);
        res.status(200).send(`Order with id ${id} was deleted.`);
    }catch( error ){
        console.error(error);
        res.status(500).send(`Error deleting order`);
    }
  }