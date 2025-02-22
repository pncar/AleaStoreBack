import { Router } from 'express';
import { getProducts, getProductById, setProductCategory, createProduct, deleteProduct, countProducts, uploadProductImage } from '../controllers/productController';
import { validateProduct, upload } from "../middleware/validations";
import { authenticateJWT, verifyRole } from "../middleware/authMiddleware";

const userRouter = Router();

userRouter.get('/', getProducts);
userRouter.get('/total', countProducts);
/*userRouter.get('/user/:id',getProductsByUser);*/
userRouter.get('/:id', getProductById);
userRouter.post(`/setCategory/`, authenticateJWT, setProductCategory);
userRouter.post(`/create`, authenticateJWT, verifyRole("admin"), (req, res, next) => {
    upload.single("image")(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      validateProduct(req, res, next);
    });
}, createProduct);
userRouter.post('/:id/delete', authenticateJWT, deleteProduct);
//userRouter.post("/upload", upload.single("image"),uploadProductImage);

export default userRouter;