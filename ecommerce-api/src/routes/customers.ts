import express from "express";
import { 
  getCustomers, 
  getCustomerById, 
  getCustomerByEmail,
  createCustomer, 
  updateCustomer, 
  deleteCustomer } from "../controllers/customerController";

const router = express.Router();

router.get("/", getCustomers)
router.get("/email/:email", getCustomerByEmail)  // Lägg till före /:id för att undvika konflikt
router.get("/:id", getCustomerById)
router.post("/", createCustomer)
router.patch("/:id", updateCustomer)
router.delete("/:id", deleteCustomer)

export default router