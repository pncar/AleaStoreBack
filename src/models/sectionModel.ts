import db from '../db/database';
import { faker } from '@faker-js/faker';

class Section {
    static async getSections(){
        try{
            const query = `SELECT * FROM sections`;
            const [rows] = await db.query(query);
            return rows;
        }catch(error){
            console.error(error);
            throw Error(`Error fetching sections.`);
        }
    }
    static async getSectionById(id:string){
        try{
            const query = `SELECT * FROM sections WHERE id = ?`;
            const [rows] = await db.query(query,[id]);
            const rowsWithCategories = Promise.all((rows as any).map(async(row:any)=>{
                const query = `SELECT category_id as id FROM sections_categories WHERE section_id = ?`;
                const [categories] = await db.query(query,[id]);
                return {...(row as any),categories: (categories as any).map((category:any) => category.id)};
            }))
            return rowsWithCategories;
        }catch(error){
            console.error(error);
            throw Error(`Error fetching section of id ${id}.`);
        }
    }
    static async getSectionCategories(id: string){
        //const query = `SELECT * FROM sections_categories WHERE section_id = ?`;
        const query = `SELECT categories.* FROM categories JOIN sections_categories ON categories.id = sections_categories.category_id WHERE sections_categories.section_id = ?`;
        try{
            const [rows] = await db.query(query,[id]);
            return rows;
        }catch(error){
            console.error(error);
            throw Error(`Error fetching categories of section ${id}`);
        }
    }
    static async createSection(name: string){
        const query = `INSERT INTO sections (name) VALUES (?)`;
        try{
            await db.query(query,[name]);
        }catch(error){
            console.log(error);
            throw Error(`Error creating section.`);
        }
    }
    static async updateSection(id: string, name: string){
        const fields: string[] = [];
        const values: string[] = [];
        if(name){
            fields.push(`name = ?`);
            values.push(name);
        }
        const t_fields = fields.join(', ');
        try{
            const query = `UPDATE sections SET ${t_fields} WHERE id = ? `;
            await db.query(query,[...values,id]);
        }catch(error){
            console.error(error);
            throw Error(`Error updating product ${id}.`);
        }
    }
    static async deleteSection(id: string){
        const query = `DELETE FROM sections WHERE id = ?`;
        try{
            await db.query(query,[id]);
        }catch(error){
            console.log(error);
            throw Error(`Error deleting section with id ${id}.`);
        }
    }
    static async addCategory(categoryId: string, sectionId: string){
        const query = `INSERT INTO sections_categories (category_id, section_id) VALUES (?,?)`;
        try{
            await db.query(query,[categoryId,sectionId]);
        }catch(error){
            console.error(error);
            throw Error(`Error inserting category ${categoryId} on section ${sectionId}.`);
        }
    }
    static async removeCategory(categoryId:string, sectionId: string){
        const query = `DELETE FROM sections_categories WHERE category_id = ? AND section_id = ?`;
        try{
            await db.query(query,[categoryId,sectionId]);
        }catch(error){
            console.error(error);
            throw Error(`Category ${categoryId} couldn't be removed from section ${sectionId}.`);
        }
    }
}

export default Section;