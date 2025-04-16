"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_1 = require("../controllers/productController");
const multer_1 = __importDefault(require("multer"));
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage: storage });
const router = express_1.default.Router();
router.get("/", productController_1.getProducts);
router.get("/:id", productController_1.getProductById);
router.post("/", upload.single('image'), productController_1.createProduct);
router.patch("/:id", upload.single('image'), productController_1.updateProduct);
router.delete("/:id", productController_1.deleteProduct);
exports.default = router;
//# sourceMappingURL=products.js.map