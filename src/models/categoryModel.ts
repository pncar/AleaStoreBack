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
    static async getCategoriesByProduct(productId:string){
        const query = `SELECT categories.* FROM categories JOIN products_categories ON categories.id = products_categories.category_id WHERE products_categories.product_id = ?`;
        const [rows] = await db.query(query,[productId]);
        return rows;
    }
    static async getChildrenCategories(parent:string){
        const query = `SELECT * FROM categories WHERE parent = ?`;
        const [rows] = await db.query(query,parent);
        return rows;
    }
    static async createCategory(name: string, parent: string){
        const query = `INSERT INTO categories (name,parent) VALUES (?,?)`;
        try{
            const [rows] = await db.query(query,[name,parent]);
            return rows;
        }catch(error){
            throw Error(`Error creating category`);
        }
    }
    static async setParentCategory(parentId:string,id:string){
        const query = `INSERT INTO categories (parent) VALUES (?) WHERE id = ?`;
        try{
            await db.query(query,[parentId,id]);
        }catch(error){
            throw Error(`Error setting parent ${parentId} to category ${id}`);
        }
    }
    static async deleteCategory(id:string){
        const query = `DELETE FROM categories WHERE id = ?`;
        try{
            await db.query(query,[id]);
        }catch(error){
            throw Error(`Error deleting category with id ${id}`);
        }
    }
}

export default Category;
