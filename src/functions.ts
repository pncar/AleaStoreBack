import express, { Request, Response } from "express";
const defaultQuery = async (res: Response, query: string, db: any) => {
    try {
        const [rows, fields] = await db.query(query);
        res.status(200).json(rows);
        } catch (error) {
        console.error(error); // Log the error for debugging purposes
        res.status(500).send('Error occurred while fetching data');
        }
}

export { defaultQuery } 