import { Router } from 'express';
import { getOrders, getOrderById, createOrder, getOrdersByUser, updateOrderStatus, deleteOrder} from '../controllers/orderController';
//import { validateProduct } from "../middleware/validations";
import { authenticateJWT, verifyIds } from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.get('/', authenticateJWT, verifyIds(), getOrders);
userRouter.get('/user/:id', authenticateJWT, verifyIds(), getOrdersByUser);
userRouter.get('/:id', authenticateJWT, verifyIds("user"), getOrderById);
userRouter.post(`/create`, authenticateJWT, createOrder);
userRouter.post(`/:id/update-status`, authenticateJWT, verifyIds("user"), updateOrderStatus);
userRouter.post(`/:id/delete`,deleteOrder);

export default userRouter;