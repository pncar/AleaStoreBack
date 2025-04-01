import { Router } from 'express';
import { getOrders, getOrderById, createOrder, getOrdersByUser, updateOrderStatus, deleteOrder} from '../controllers/orderController';
//import { validateProduct } from "../middleware/validations";
import { authenticateJWT, verifyIds, verifyRole } from "../middleware/authMiddleware";
import { validateOrder } from "../middleware/validations";

const orderRouter = Router();

orderRouter.get('/', authenticateJWT, verifyIds(), getOrders);
orderRouter.get('/user/:id', authenticateJWT, verifyIds(), getOrdersByUser);
orderRouter.get('/:id', authenticateJWT, verifyIds("user"), getOrderById);
orderRouter.post(`/`, authenticateJWT, validateOrder, createOrder);
orderRouter.patch(`/:id/`, authenticateJWT, verifyIds("user"), updateOrderStatus);
orderRouter.delete(`/:id/`, verifyRole("admin"), deleteOrder);

export default orderRouter;