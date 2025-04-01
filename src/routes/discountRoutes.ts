import { Router } from 'express';
import { getDiscounts, getDiscountById, getDiscountByProduct, createDiscount, updateDiscount, deleteDiscount } from '../controllers/discountController';
import { authenticateJWT, verifyIds, verifyRole } from "../middleware/authMiddleware";
import { validateDiscount, validateDiscountUpdate } from "../middleware/validations";

const discountRouter = Router();

discountRouter.get(`/`,authenticateJWT, verifyRole("admin"), getDiscounts);
discountRouter.get(`/product/:productId`,authenticateJWT, verifyRole("admin"), getDiscountByProduct);
discountRouter.get(`/:id`,authenticateJWT, verifyRole("admin"), getDiscountById);
discountRouter.post(`/`, authenticateJWT, verifyRole("admin"), validateDiscount, createDiscount);
discountRouter.patch(`/:id`,authenticateJWT, verifyRole("admin"), validateDiscountUpdate, updateDiscount);
discountRouter.delete(`/:id`,authenticateJWT, verifyRole("admin"),deleteDiscount);

export default discountRouter;
