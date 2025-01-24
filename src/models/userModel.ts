import db from '../db/database';
import { faker } from '@faker-js/faker';

class User {
    static async getUsers() {
      const query = 'SELECT * FROM users';
      const [rows] = await db.query(query);
      return rows;
    }
}

export default User;
