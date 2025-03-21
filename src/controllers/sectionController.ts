import Section from "../models/sectionModel";

import { Request, Response } from 'express';

export const getSections = async (req: Request, res: Response) => {
    try{
        const sections = await Section.getSections();
        res.status(200).send(sections);
    }catch(error){
        console.error(error);
        res.status(500).send({message: `Error fetching sections`});
    }
}
export const getSectionById = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        const section = await Section.getSectionById(id);
        res.status(200).send(section);
    }catch(error){
        console.error(error);
        res.status(500).send({message: `Error fetching section ${id}`});
    }
}
export const getSectionCategories = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        const categories = await Section.getSectionCategories(id);
        res.status(200).send(categories);
    }catch(error){
        console.error(error);
        res.status(500).send({message: `Error fetching categories of section ${id}`});
    }
}
export const createSection = async (req: Request, res: Response) => {
    const { name } = req.body;
    try{
        await Section.createSection(name);
        res.status(201).send({message: `Section with name ${name} was created successfully.`});
    }catch(error){
        console.error(error);
        res.status(500).send({message: `Error creating section with name: ${name}.`});
    }
}
export const updateSection = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { name } = req.body;
    try{
        await Section.updateSection(id,name);
        res.status(200).send({mesage: `Section ${id} was successfully updated.`});
    }catch(error){
        console.error(error);
        res.status(500).send({message: `Error updating Section ${id}.`});
    }
}
export const deleteSection = async (req: Request, res: Response) => {
    const { id } = req.params;
    try{
        await Section.deleteSection(id);
        res.status(200).send({message: `Section with id ${id} was deleted successfully.`});
    }catch(error){
        console.error(error);
        res.status(500).send({message: `Error deleting section with id: ${id}.`});
    }
}
export const addCategory = async (req: Request, res: Response) => {
    const {categoryId} = req.body;
    const {sectionId} = req.params;
    try{
        await Section.addCategory(categoryId,sectionId);
        res.status(200).send({message: `Category ${categoryId} was successfully added to section ${sectionId}.`})
    }catch(error){
        console.error(error);
        res.status(500).send({message: `Error adding category ${categoryId} to section ${sectionId}.`})
    }
}
export const removeCategory = async (req: Request, res: Response) => {
    const {categoryId,sectionId} = req.params;
    try{
        await Section.removeCategory(categoryId,sectionId);
        res.status(200).send({message: `Category ${categoryId} was successfully removed from section ${sectionId}.`});
    }catch(error){
        console.error(error);
        res.status(500).send({message: `Error removing cateogry ${categoryId} from section ${sectionId}.`});
    }
}