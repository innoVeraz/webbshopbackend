"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProductById = exports.getProducts = void 0;
const db_1 = require("../config/db");
const logger_1 = require("../utilities/logger");
const getProducts = async (_, res) => {
    try {
        const sql = "SELECT * FROM products";
        const [rows] = await db_1.db.query(sql);
        res.json(rows);
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.getProducts = getProducts;
const getProductById = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "SELECT * FROM products WHERE id = ?";
        const [rows] = await db_1.db.query(sql, [id]);
        rows && rows.length > 0
            ? res.json(rows[0])
            : res.status(404).json({ message: 'Product not found' });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.getProductById = getProductById;
const createProduct = async (req, res) => {
    const { name, description, price, stock, category } = req.body;
    const imageBuffer = req.file?.buffer;
    if (!imageBuffer) {
        res.status(400).json({ message: 'Image is required' });
        return;
    }
    try {
        const sql = `
      INSERT INTO products (name, description, price, stock, category, image) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
        const params = [name, description, price, stock, category, imageBuffer];
        const [result] = await db_1.db.query(sql, params);
        res.status(201).json({ message: 'Product created', id: result.insertId });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.createProduct = createProduct;
const updateProduct = async (req, res) => {
    const id = req.params.id;
    const { name, description, price, stock, category } = req.body;
    const imageBuffer = req.file?.buffer;
    try {
        let sql;
        let params;
        if (imageBuffer) {
            sql = `
        UPDATE products 
        SET name = ?, description = ?, price = ?, stock = ?, category = ?, image = ? 
        WHERE id = ?
      `;
            params = [name, description, price, stock, category, imageBuffer, id];
        }
        else {
            sql = `
        UPDATE products 
        SET name = ?, description = ?, price = ?, stock = ?, category = ?
        WHERE id = ?
      `;
            params = [name, description, price, stock, category, id];
        }
        const [result] = await db_1.db.query(sql, params);
        result.affectedRows === 0
            ? res.status(404).json({ message: 'Product not found' })
            : res.json({ message: 'Product updated' });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.updateProduct = updateProduct;
const deleteProduct = async (req, res) => {
    const id = req.params.id;
    try {
        const sql = "DELETE FROM products WHERE id = ?";
        const [result] = await db_1.db.query(sql, [id]);
        result.affectedRows === 0
            ? res.status(404).json({ message: 'Product not found' })
            : res.json({ message: 'Product deleted' });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.deleteProduct = deleteProduct;
//# sourceMappingURL=productController.js.map