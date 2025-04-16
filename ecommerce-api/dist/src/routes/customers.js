"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const customerController_1 = require("../controllers/customerController");
const router = express_1.default.Router();
router.get("/", customerController_1.getCustomers);
router.get("/email/:email", customerController_1.getCustomerByEmail); // Lägg till före /:id för att undvika konflikt
router.get("/:id", customerController_1.getCustomerById);
router.post("/", customerController_1.createCustomer);
router.patch("/:id", customerController_1.updateCustomer);
router.delete("/:id", customerController_1.deleteCustomer);
exports.default = router;
//# sourceMappingURL=customers.js.map