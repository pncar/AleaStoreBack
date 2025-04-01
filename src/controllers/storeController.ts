import { Request, Response } from 'express';
import StoreSettings from "../models/storeModel";

export const getStoreInfo = async (req: Request, res: Response) => {
    try{
        const [info] = await StoreSettings.getStoreInfo();
        res.status(200).send(info);
    }catch(error){
        console.error(error);
        res.status(500).send({message: `Error fetching store info.`});
    }
}
export const updateStoreInfo = async (req: Request, res: Response) => {
    const { store_name, store_subtitle, store_slug } = req.body;
    try{
        await StoreSettings.updateStoreInfo(store_name, store_subtitle, store_slug);
        res.status(200).send(`Store Settings were updated successfully.`);
    }catch (error) {    
        console.error(error);
        res.status(500).send('Error updating Store Settings');
    }
}