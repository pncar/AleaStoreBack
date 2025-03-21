import { Router } from 'express';
import { getCategories, getCategory, getCategoriesByTier, getCategoriesByProduct, getChildrenCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authenticateJWT, verifyRole } from "../middleware/authMiddleware";

const categoryRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *             type: integer
 *             description: Category ID
 *         name:
 *             type: string
 *             description: Category Name
 *         description:
 *             type: string
 *             description: Category's Description
 *         parent:
 *             type: integer
 *             description: Category's Parent Category (Can be Null)
 *         tier:
 *             type: integer
 *             description: Category's Tier (Can be Null)
 *       example:
 *         id: 6
 *         name: Headphones
 *         description: Audio ouput device, can be connected to PC, Laptop, Phone, Tablet.
 *         parent: 2
 *         tier: 2
 * 
 */

/** 
 * tags:
 *  name: Categories
 *  description: Categories tag. 
*/

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Retrieve all categories
 *     description: Returns a list of categories.
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       404:
 *          $ref: '#/components/responses/NotFoundError'
 *   post:
 *     summary: Create a new category
 *     description: Creates a new category
 *     tags: [Categories]
 *     parameters:
 *       - in: body
 *         name: name
 *         required: true
 *         type: string
 *         description: Category Name
 *       - in: body
 *         name: parent
 *         required: false
 *         type: string
 *         description: Category Parent
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Category created successfully.
*/

categoryRouter.get('/', authenticateJWT, verifyRole("admin"), getCategories);
categoryRouter.get('/tier/:tier', authenticateJWT, verifyRole("admin"), getCategoriesByTier);
categoryRouter.get('/product/:productId', authenticateJWT, verifyRole("admin"), getCategoriesByProduct);
categoryRouter.get('/:parent/children', authenticateJWT, verifyRole("admin"), getChildrenCategories);
categoryRouter.get('/:id', authenticateJWT, verifyRole("admin"), getCategory);
categoryRouter.post('/', authenticateJWT, verifyRole("admin"), createCategory);
categoryRouter.patch('/:id/', authenticateJWT, verifyRole("admin"), updateCategory);
categoryRouter.delete('/:id/', authenticateJWT, verifyRole("admin"), deleteCategory);
// userRouter.post('/setParent', setParent);

export default categoryRouter;