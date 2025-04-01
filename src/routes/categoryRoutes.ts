import { Router } from 'express';
import { getCategories, getCategory, getCategoriesByTier, getCategoriesByProduct, getChildrenCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController';
import { authenticateJWT, verifyRole } from "../middleware/authMiddleware";
import { validateCategory, validateCategoryUpdate } from "../middleware/validations";

const categoryRouter = Router();

categoryRouter.get('/', getCategories);
categoryRouter.get('/tier/:tier', getCategoriesByTier);
categoryRouter.get('/product/:productId', getCategoriesByProduct);
categoryRouter.get('/:parent/children', getChildrenCategories);
categoryRouter.get('/:id', getCategory);
categoryRouter.post('/', authenticateJWT, verifyRole("admin"), validateCategory, createCategory);
categoryRouter.patch('/:id/', authenticateJWT, verifyRole("admin"), validateCategoryUpdate, updateCategory);
categoryRouter.delete('/:id/', authenticateJWT, verifyRole("admin"), deleteCategory);
// userRouter.post('/setParent', setParent);

export default categoryRouter;