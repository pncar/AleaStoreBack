import { Router } from 'express';
import { getStoreInfo, updateStoreInfo } from '../controllers/storeController';
import { authenticateJWT, verifyIds, verifyRole } from "../middleware/authMiddleware";
import { validateUser, validateSectionUpdate } from "../middleware/validations";

const storeInfoRouter = Router();

storeInfoRouter.get('/', getStoreInfo);
storeInfoRouter.patch('/', authenticateJWT, verifyRole("admin"), updateStoreInfo);

export default storeInfoRouter;