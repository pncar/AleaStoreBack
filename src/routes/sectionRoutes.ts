import { Router } from 'express';
import { getSections, getSectionById, getSectionCategories, createSection, updateSection, deleteSection, addCategory, removeCategory } from '../controllers/sectionController';
import { authenticateJWT, verifyIds, verifyRole } from "../middleware/authMiddleware";
import { validateSection, validateSectionUpdate } from "../middleware/validations";

const sectionRouter = Router();

sectionRouter.get('/', getSections);
sectionRouter.get('/:id', getSectionById);
sectionRouter.get('/:id/categories', getSectionCategories);
sectionRouter.post('/', authenticateJWT, verifyRole("admin"), validateSection, createSection);
sectionRouter.patch('/:id/',authenticateJWT, verifyRole("admin"), validateSectionUpdate, updateSection);
sectionRouter.delete('/:id/', authenticateJWT, verifyRole("admin"), deleteSection);
sectionRouter.post('/:sectionId/categories',authenticateJWT, verifyRole("admin"), addCategory);
sectionRouter.delete('/:sectionId/categories/:categoryId',authenticateJWT, verifyRole("admin"), removeCategory);


export default sectionRouter;