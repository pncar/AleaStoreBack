import multer from 'multer';
import { Request, Response, NextFunction } from 'express';

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


export { validateProduct, upload };