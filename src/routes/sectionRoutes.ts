import { Router } from 'express';
import { getSections, getSectionById, getSectionCategories, createSection, updateSection, deleteSection, addCategory, removeCategory } from '../controllers/sectionController';
import { authenticateJWT, verifyIds, verifyRole } from "../middleware/authMiddleware";

const sectionRouter = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Section:
 *       type: object
 *       required:
 *         - name
 *       properties:
 *         id:
 *             type: integer
 *             description: Section ID
 *         name:
 *             type: string
 *             description: Section Name
 *       example:
 *         id: 1
 *         name: Popular Last Week
 *     ErrorResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: Error message
 *       example:
 *         message: Resource not found
 * 
 *   responses:
 *     NotFoundError:
 *       description: Resource not found
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ErrorResponse'
 * 
 *     InternalServerError:
 *        description: Internal server error
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/ErrorResponse'
 */

/** 
 * tags:
 *  name: Sections
 *  description: Sections tag. 
*/

/**
 * @swagger
 * /api/sections:
 *   get:
 *     summary: Retrieve all sections
 *     description: Returns a list of sections.
 *     tags: [Sections]
 *     responses:
 *       200:
 *         description: A list of sections.
 *         content: 
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Section'
 *       404:
 *          $ref: '#/components/responses/NotFoundError'
 *   post:
 *     summary: Create a new section
 *     description: Creates a new section.
 *     tags: [Sections]
 *     parameters:
 *       - in: body
 *         name: name
 *         required: true
 *         type: string
 *         description: Section Name
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Section created successfully.
 * 
 * /api/sections/{id}:
 *   get:
 *     summary: Retrieve a section by ID
 *     description: Returns a section object.
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Section ID
 *     responses:
 *       200:
 *         description: A section object.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Section'
 *       404:
 *          $ref: '#/components/responses/NotFoundError'
 *
 * /api/sections/{id}/categories:
 *   get:
 *     summary: Retrieve categories for a section
 *     description: Returns a list of categories which are bound to the Section of ID.
 *     tags: [Sections]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Section ID
 *     responses:
 *       200:
 *         description: A list of categories.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 *       400:
 *         $ref: '#/components/responses/NotFoundError'
 *
 * /api/sections/{id}/:
 *   patch:
 *     summary: Update a section
 *     tags: [Sections]
 *     description: Updates a section.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Section ID
 *       - in: body
 *         name: name
 *         required: true
 *         type: string
 *         description: Section Name (New)
 *     responses:
 *       200:
 *         description: Section updated successfully.
 *   delete:
 *     summary: Delete a section
 *     tags: [Sections]
 *     description: Deletes a section.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Section ID
 *     responses:
 *       204:
 *         description: Section deleted successfully.
 *
 * /api/sections/{id}/categories/:
 *   post:
 *     summary: Add a category to a section
 *     description: Adds a category to a section.
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: body
 *         name: sectionId
 *         required: true
 *         description: Section ID
 *       - in: body
 *         name: categoryId
 *         required: true
 *         description: ID of Category to be added to section.
 *         type: number
 *     responses:
 *       200:
 *         description: Category added successfully.
 *
 * /api/sections/{id}/categories/{categoryId}/:
 *   delete:
 *     summary: Remove a category from a section
 *     description: Removes a category from a section.
 *     tags: [Sections]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Section ID
 *       - in: path
 *         name: categoryId
 *         required: true
 *         description: ID of Category to remove from section.
 *     responses:
 *       200:
 *         description: Category removed successfully.
 */

sectionRouter.get('/', getSections);
sectionRouter.get('/:id', getSectionById);
sectionRouter.get('/:id/categories', getSectionCategories);
sectionRouter.post('/', authenticateJWT, verifyRole("admin"), createSection);
sectionRouter.patch('/:id/',authenticateJWT, verifyRole("admin"), updateSection);
sectionRouter.delete('/:id/', authenticateJWT, verifyRole("admin"), deleteSection);
sectionRouter.post('/:sectionId/categories',authenticateJWT, verifyRole("admin"), addCategory);
sectionRouter.delete('/:sectionId/categories/:categoryId',authenticateJWT, verifyRole("admin"), removeCategory);


export default sectionRouter;