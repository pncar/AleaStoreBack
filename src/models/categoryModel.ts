import db from '../db/database';

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
    static async getCategoriesByTier(tier:string){
        const query = `SELECT * FROM categories WHERE tier = ?`;
        const [rows] = await db.query(query,tier);
        return rows;
    }
    static async setParentCategory(parentId:string,id:string){
        const query = `INSERT INTO categories (parent) VALUES (?) WHERE id = ?`;
        try{
            await db.query(query,[parentId,id]);
        }catch(error){
            throw Error(`Error setting parent ${parentId} to category ${id}`);
        }
    }
}

export default Category;
