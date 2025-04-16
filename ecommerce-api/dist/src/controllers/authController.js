"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = exports.clearToken = exports.refreshToken = exports.login = void 0;
const db_1 = require("../config/db");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const logger_1 = require("../utilities/logger");
// Säkerställ att JWT-secret finns
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_for_development';
const login = async (req, res) => {
    let user = null;
    const { username, password } = req.body;
    if (username === undefined || password === undefined) {
        res.status(400).json({ success: false, message: "Missing required fields (username/password)" });
        return;
    }
    try {
        const sql = "SELECT * FROM users WHERE username = ?";
        const [rows] = await db_1.db.query(sql, [username]);
        if (rows && rows.length > 0) {
            user = rows[0];
        }
        else {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        if (user && await bcryptjs_1.default.compare(password.toString(), user.password)) {
            const userInfo = {
                username: user.username,
                created_at: user.created_at,
            };
            const refreshToken = jsonwebtoken_1.default.sign(userInfo, JWT_SECRET, { expiresIn: '7d' });
            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                secure: false,
                sameSite: 'none',
                maxAge: 1000 * 60 * 60 * 24 * 7,
                path: '/auth/refresh-token'
            });
            const accessToken = jsonwebtoken_1.default.sign(userInfo, JWT_SECRET, { expiresIn: '15m' });
            res.json({
                success: true,
                user: { username: userInfo.username },
                expires_in: 60 * 15,
                token: accessToken
            });
            return;
        }
        else {
            res.status(401).json({ success: false, message: "Incorrect user credentials" });
            return;
        }
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.login = login;
const refreshToken = async (req, res) => {
    try {
        const userInfo = {
            username: req.user.username,
            created_at: req.user.created_at,
        };
        const refreshToken = jsonwebtoken_1.default.sign(userInfo, JWT_SECRET, { expiresIn: '7d' });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: 'none',
            maxAge: 1000 * 60 * 60 * 24 * 7,
            path: '/auth/refresh-token'
        });
        const accessToken = jsonwebtoken_1.default.sign(userInfo, JWT_SECRET, { expiresIn: '15m' });
        res.json({
            user: { username: userInfo.username },
            expires_in: 60 * 15,
            token: accessToken
        });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.refreshToken = refreshToken;
const clearToken = async (req, res) => {
    try {
        res.clearCookie('refreshToken', { path: '/auth/refresh-token' });
        res.json({ success: true, message: 'Token cleared' });
    }
    catch (error) {
        res.json({ success: false, message: error });
    }
};
exports.clearToken = clearToken;
const register = async (req, res) => {
    const { username, password } = req.body;
    if (username === undefined || password === undefined) {
        res.status(400).json({ success: false, message: "Missing required fields (username/password)" });
        return;
    }
    try {
        const hashedPassword = await bcryptjs_1.default.hash(password.toString(), 10);
        const sql = `
      INSERT INTO users (username, password)
      VALUES (?, ?)
    `;
        const params = [username, hashedPassword];
        await db_1.db.query(sql, params);
        res.status(201).json({ success: true, message: 'User registered', user: {
                username: username
            } });
    }
    catch (error) {
        res.status(500).json({ error: (0, logger_1.logError)(error) });
    }
};
exports.register = register;
//# sourceMappingURL=authController.js.map