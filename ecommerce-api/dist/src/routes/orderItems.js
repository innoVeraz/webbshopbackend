"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const orderItemController_1 = require("../controllers/orderItemController");
const router = express_1.default.Router();
router.patch("/:id", orderItemController_1.updateOrderItem);
router.delete("/:id", orderItemController_1.deleteOrderItem);
exports.default = router;
//# sourceMappingURL=orderItems.js.map