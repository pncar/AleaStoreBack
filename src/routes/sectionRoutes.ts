import { Router } from 'express';
import { getSections, getSectionById, getSectionCategories, createSection, updateSection, deleteSection, addCategory, removeCategory } from '../controllers/sectionController';
import { authenticateJWT, verifyIds, verifyRole } from "../middleware/authMiddleware";

const sectionRouter = Router();

sectionRouter.get('/', getSections);
sectionRouter.get('/:id', getSectionById);
sectionRouter.get('/:id/categories', getSectionCategories);
sectionRouter.post('/create', authenticateJWT, verifyRole("admin"), createSection);
sectionRouter.post('/:id/update',authenticateJWT, verifyRole("admin"), updateSection);
sectionRouter.post('/:id/delete', authenticateJWT, verifyRole("admin"), deleteSection);
sectionRouter.post('/add-category/',authenticateJWT, verifyRole("admin"), addCategory);
sectionRouter.post('/remove-category/',authenticateJWT, verifyRole("admin"), removeCategory);


export default sectionRouter;