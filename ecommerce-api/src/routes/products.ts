import express from "express";
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct } from "../controllers/productController";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });
const router = express.Router();

router.get("/", getProducts)
router.get("/:id", getProductById)
router.post("/", upload.single('image'), createProduct)
router.patch("/:id", upload.single('image'), updateProduct)
router.delete("/:id", deleteProduct)

export default router