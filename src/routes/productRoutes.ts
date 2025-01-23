import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/productController';

const userRouter = Router();

userRouter.get('/', getProducts);
userRouter.get('/:id', getProductById);

export default userRouter;