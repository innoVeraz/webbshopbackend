"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteOrderItem = exports.updateOrderItem = void 0;
const db_1 = require("../config/db");
const logger_1 = require("../utilities/logger");
const updateOrderItem = async (req, res) => {
    const id = req.params.id;
    const { quantity } = req.body;
    if (quantity <= 0) {
        res.status(400).json({ message: 'Quantity must be greater than 0' });
        return;
    }
    try {
        const sql = `
      UPDATE order_items
      SET 
        quantity = ?
      WHERE id = ?
    `;
        const params = [quantity, id];
        const [result] = await db_1.db.query(sql, params);
        const [rows] = await db_1.db.query("SELECT * FROM order_items WHERE id = ?", [id]);
        await updateOrderTotalPrice(rows[0].order_id);
        console.log(rows[0].order_id);
        result.affectedRows === 0
            ? res.status(404).json({ message: 'Order item not found' })
            : res.json({ message: 'Order item updated' });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.updateOrderItem = updateOrderItem;
const deleteOrderItem = async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await db_1.db.query("SELECT * FROM order_items WHERE id = ?", [id]);
        const sql = "DELETE FROM order_items WHERE id = ?";
        const [result] = await db_1.db.query(sql, [id]);
        await updateOrderTotalPrice(rows[0].order_id);
        result.affectedRows === 0
            ? res.status(404).json({ message: 'Order item not found' })
            : res.json({ message: 'Order item deleted' });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.deleteOrderItem = deleteOrderItem;
const updateOrderTotalPrice = async (order_id) => {
    try {
        const sql = `
      UPDATE orders
      SET total_price = (
        SELECT COALESCE(SUM(unit_price * quantity),0) 
        FROM order_items 
        WHERE order_id = ?
      )
      WHERE id = ?
    `;
        const params = [order_id, order_id];
        await db_1.db.query(sql, params);
    }
    catch (error) {
        throw new Error;
    }
};
//# sourceMappingURL=orderItemController.js.map