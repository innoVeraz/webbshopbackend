"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCustomer = exports.updateCustomer = exports.createCustomer = exports.getCustomerByEmail = exports.getCustomerById = exports.getCustomers = void 0;
const db_1 = require("../config/db");
const logger_1 = require("../utilities/logger");
const getCustomers = async (_, res) => {
    try {
        const sql = "SELECT * FROM customers";
        const [rows] = await db_1.db.query(sql);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.getCustomers = getCustomers;
const getCustomerById = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "SELECT * FROM customers WHERE id = ?";
        const [rows] = await db_1.db.query(sql, [id]);
        rows && rows.length > 0
            ? res.json(rows[0])
            : res.status(404).json({ message: 'Customer not found' });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.getCustomerById = getCustomerById;
const getCustomerByEmail = async (req, res) => {
    const email = req.params.email;
    try {
        const sql = "SELECT * FROM customers WHERE email = ?";
        const [rows] = await db_1.db.query(sql, [email]);
        rows && rows.length > 0
            ? res.json(rows[0])
            : res.status(404).json({ message: 'Customer not found' });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.getCustomerByEmail = getCustomerByEmail;
const createCustomer = async (req, res) => {
    const { firstname, lastname, email, password, phone, street_address, postal_code, city, country } = req.body;
    try {
        const sql = `
      INSERT INTO customers (firstname, lastname, email, password, phone, street_address, postal_code, city, country)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
        const params = [firstname, lastname, email, password, phone, street_address, postal_code, city, country];
        const [result] = await db_1.db.query(sql, params);
        res.status(201).json({ message: 'Customer created', id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.createCustomer = createCustomer;
const updateCustomer = async (req, res) => {
    const id = req.params.id;
    const { firstname, lastname, email, password, phone, street_address, postal_code, city, country } = req.body;
    try {
        const sql = `
      UPDATE customers 
      SET firstname = ?, lastname = ?, email = ?, password = ?, phone = ?, street_address = ?, postal_code = ?, city = ?, country = ?
      WHERE id = ?
    `;
        const params = [firstname, lastname, email, password, phone, street_address, postal_code, city, country, id];
        const [result] = await db_1.db.query(sql, params);
        result.affectedRows === 0
            ? res.status(404).json({ message: 'Customer not found' })
            : res.json({ message: 'Customer updated' });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.updateCustomer = updateCustomer;
const deleteCustomer = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "DELETE FROM customers WHERE id = ?";
        const [result] = await db_1.db.query(sql, [id]);
        result.affectedRows === 0
            ? res.status(404).json({ message: 'Customer not found' })
            : res.json({ message: 'Customer deleted' });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.deleteCustomer = deleteCustomer;
//# sourceMappingURL=customerController.js.map