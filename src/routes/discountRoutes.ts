import { Router } from 'express';
import { getDiscounts, getDiscountById, getDiscountByProduct, createDiscount, updateDiscount, deleteDiscount } from '../controllers/discountController';
import { authenticateJWT, verifyIds, verifyRole } from "../middleware/authMiddleware";

const discountRouter = Router();

discountRouter.get(`/`,authenticateJWT, verifyRole("admin"), getDiscounts);
discountRouter.get(`/product/:productId`,authenticateJWT, verifyRole("admin"), getDiscountByProduct);
discountRouter.get(`/:id`,authenticateJWT, verifyRole("admin"), getDiscountById);
discountRouter.post(`/create`, authenticateJWT, verifyRole("admin"), createDiscount);
discountRouter.post(`/update/:id`,authenticateJWT, verifyRole("admin"), updateDiscount);
discountRouter.post(`/delete/:id`,authenticateJWT, verifyRole("admin"),deleteDiscount);

export default discountRouter;
