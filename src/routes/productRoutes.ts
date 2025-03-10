import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, countProducts, setProductDiscount, removeDiscountFromProduct , setProductCategory, removeCategoryFromProduct,  uploadProductImage } from '../controllers/productController';
import { validateProduct, upload } from "../middleware/validations";
import { authenticateJWT, verifyRole } from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.get('/', getProducts);
userRouter.get('/total', countProducts);
userRouter.get('/:id', getProductById);
userRouter.post(`/create`, authenticateJWT, verifyRole("admin"), (req, res, next) => {
    upload.single("image")(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      validateProduct(req, res, next);
    });
}, createProduct);
userRouter.post('/:id/update/', authenticateJWT, upload.single("image"), updateProduct);
userRouter.post('/:id/delete', authenticateJWT, verifyRole("admin"), deleteProduct);
userRouter.post('/set-product-discount',authenticateJWT, verifyRole("admin"),setProductDiscount);
userRouter.post(`/set-category/`, authenticateJWT, setProductCategory); // "set Product Category" would be better
userRouter.post('/remove-discount', authenticateJWT, verifyRole("admin"), removeDiscountFromProduct);
userRouter.post('/remove-category',authenticateJWT,verifyRole("admin"),removeCategoryFromProduct);

export default userRouter;