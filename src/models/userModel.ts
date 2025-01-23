import db from '../db/database';
import { faker } from '@faker-js/faker';

export const getUsers2 = async () => {
    const query = 'SELECT * FROM users';
    const [rows] = await db.query(query);
    return rows;
};
