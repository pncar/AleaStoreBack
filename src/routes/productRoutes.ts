import { Router } from 'express';
import { getProducts, getProductById, createProduct, updateProduct, deleteProduct, countProducts, setProductDiscount, removeDiscountFromProduct , setProductCategory, removeCategoryFromProduct,  uploadProductImage } from '../controllers/productController';
import { validateProduct, upload } from "../middleware/validations";
import { authenticateJWT, verifyRole } from "../middleware/authMiddleware";

const productRouter = Router();

productRouter.get('/', getProducts);
productRouter.get('/total', countProducts);
productRouter.get('/:id', getProductById);
productRouter.post(`/`, authenticateJWT, verifyRole("admin"), (req, res, next) => {
    upload.single("image")(req, res, (err: any) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      validateProduct(req, res, next);
    });
}, createProduct);
productRouter.patch('/:id/', authenticateJWT, upload.single("image"), updateProduct);
productRouter.delete('/:id/', authenticateJWT, verifyRole("admin"), deleteProduct);

productRouter.post('/:productId/discounts/',authenticateJWT, verifyRole("admin"),setProductDiscount);
productRouter.post(`/:productId/categories/`, authenticateJWT, setProductCategory); // "set Product Category" would be better
productRouter.delete('/:productId/discounts/:discountId', authenticateJWT, verifyRole("admin"), removeDiscountFromProduct);
productRouter.delete('/:productId/categories/:categoryId',authenticateJWT,verifyRole("admin"),removeCategoryFromProduct);

export default productRouter;