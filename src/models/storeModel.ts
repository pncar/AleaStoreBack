import db from '../db/database';
import { ResultSetHeader, RowDataPacket } from 'mysql2';

class StoreSettings {
    static async getStoreInfo(){
        const query = 'SELECT store_name, store_subtitle, store_slug FROM settings';
        const [rows] = await db.query<ResultSetHeader[] & StoreSettingsType[]>(query);
        return rows;
    }
    static async updateStoreInfo(store_name?: string, store_subtitle?: string, store_slug?: string){
        const fields: string[] = [];
        const values: string[] = [];
        if(store_name){
            fields.push(`store_name = ?`);
            values.push(store_name);
        }
        if(store_subtitle){
            fields.push(`store_subtitle = ?`);
            values.push(store_subtitle);
        }
        if(store_slug){
            fields.push(`store_slug = ?`);
            values.push(store_slug);
        }
        const t_fields = fields.join(", ");
        const query = `UPDATE settings SET ${t_fields}`;
        console.log(query);
        try{
            const [rows] = await db.query(query,[store_name,store_subtitle,store_slug]);
            return rows;
        }catch(error){
            console.log(error);
            throw Error(`Failed at updating Store Settings`);
        }
    }
}

export default StoreSettings;