import db from '../db/database';

class Discount {
    static async getDiscounts(){
        const query = `SELECT * FROM discounts`;
        const [rows] = await db.query(query);
        return rows;
    }
    static async getDiscountById(id:string){
        const query = `SELECT * FROM discounts WHERE id = ?`;
        const [rows] = await db.query(query,[id]);
        return rows;
    }
    static async getDiscountsByProduct(productId:string){
        const query = `SELECT discounts.* FROM discounts JOIN products_discounts ON discounts.id = products_discounts.discount_id WHERE products_discounts.product_id = ?`;
        const [rows] = await db.query(query,[productId]);
        return rows;
    }
    static async createDiscount(name: string, rate:string){
        const query = `INSERT INTO discounts (type, name, rate) VALUES (?,?,?)`;
        const values = ["discount",name,rate];
        try{
            //const [insert] = await db.query(query,values);
            await db.query(query,values);
            //const nog = await (insert as any).insertId;
            //await db.query(`INSERT INTO products_discounts (product_id, discount_id) VALUES (?,?)`,[productId,(insert as any).insertId]);
        }catch(error){
            console.log(error);
            throw Error(`Error creating discount.`);
        }
    }
    static async updateDiscount(id:string,name:string,rate:string){
        const fields: string[] = [];
        const values: string[] = [];
        const data = {name, rate};

        Object.entries(data).map((item:any)=>{
            fields.push(`${item[0]} = ?`);
            values.push(item[1]);
        });

        const t_fields = fields.join(", ");

        try{
            const query = `UPDATE discounts SET ${t_fields} WHERE id = ?`;
            await db.query(query,[...values,id]);
        }catch(error){
            throw Error(`Error updating product ${id}`);
        }
    }
    static async deleteDiscount(id:string){
        try{
            const query = `DELETE FROM discounts WHERE id = ?`;
            await db.query(query,[id]);
        }catch (error){
            throw Error(`Error deleting discount`);
        }
    }
}

export default Discount;