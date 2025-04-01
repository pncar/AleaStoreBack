import multer from 'multer';
import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from "express-validator";

interface ProductData {
  name: string;
  price: string;
  category: string;
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // The directory to store the uploaded file
  },
  filename: (req, file, cb) => {
    const ext = file.originalname.split(".")[1];
    cb(null, `${Date.now()}-${file.originalname.slice(0,8)}.${ext}`); // Unique filename
  },
});

const upload = multer(
  { 
    storage, 
    limits: { fileSize: 1024 * 1024 } ,
    fileFilter(req, file, cb) {
      if (!file.mimetype.startsWith('image/')) {
        return cb(new Error('Only image files are allowed!'));
      }
      cb(null, true);
    },
  }); // Handles `multipart/form-data`

const validateProduct = (req: Request, res: Response, next: NextFunction) => {
  const productData: ProductData = req.body;

  // Log the incoming form data (including the file)
  console.log('Form Fields:', req.body);
  console.log('Uploaded File:', req.file); // Access the uploaded file

  if (!productData.name || !productData.price || !productData.category) {
    res.status(400).json({ error: 'Missing required parameters' });
  }
  next();

};

const validationHandler = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorMsgs = errors.array().map((error: {msg: string})=>{
      return error.msg;
    });
    res.status(400).json({ message: errorMsgs.join(" "), errors: errors.array() });
    return;
  }
  next();
};

const validateCategory = [
  body("name")
    .trim()
    .escape()
    .notEmpty().withMessage("Category name is required."),
  body("parent")
    .optional()
    .isInt().withMessage("Parent must be an integer.")
    .toInt(),
  validationHandler
];

const validateCategoryUpdate = [
  body("name")
    .trim()
    .escape()
    .notEmpty().withMessage("Category name is required."),
  validationHandler
]

const validateDiscount = [
  body("name")
    .trim()
    .escape()
    .notEmpty().withMessage("Discount name is required."),
  body("rate")
    .isInt({min: 1, max:99}).withMessage("Rate must be an integer.")
    .toInt(),
  validationHandler
];

const validateDiscountUpdate = [
  body("name")
    .optional()
    .trim()
    .escape()
    .notEmpty().withMessage("Discount name is required."),
  body("rate")
    .optional()
    .isInt({min: 1, max:99}).withMessage("Rate must be an integer.")
    .toInt(),
  validationHandler
]

const validateSection = [
  body("name")
    .trim()
    .escape()
    .notEmpty().withMessage("Section name is required."),
  validationHandler
];

const validateSectionUpdate = [
  body("name")
    .optional()
    .trim()
    .escape()
    .notEmpty().withMessage("Section name is required."),
  validationHandler
]

const validateUser = [
  body("name")
    .trim()
    .escape()
    .notEmpty().withMessage("User name is required."),
  body("email")
    .trim()
    .escape()
    .notEmpty().withMessage("Email is required."),
  body("password")
    .trim()
    .escape()
    .notEmpty().withMessage("Password is required"),
  validationHandler
];

const validateUserUpdate = [
  body("name")
    .optional()
    .trim()
    .escape()
    .notEmpty().withMessage("User name is required."),
  body("email")
    .optional()
    .trim()
    .escape()
    .notEmpty().withMessage("Email is required."),
  body("password")
    .optional()
    .trim()
    .escape()
    .notEmpty().withMessage("Password is required"),
  validationHandler
];

const validateOrder = [
  body("user_id")
    .toInt(),
  validationHandler
]

export { validateUser, validateUserUpdate, validateOrder, validateCategory, validateCategoryUpdate, validateDiscount, validateDiscountUpdate, validateSection, validateSectionUpdate, validateProduct, upload };