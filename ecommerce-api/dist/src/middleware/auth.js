"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyRefreshToken = exports.verifyAccessToken = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// Säkerställ att JWT-secret finns
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_for_development';
const verifyAccessToken = (req, res, next) => {
    const bearer = req.headers['authorization'];
    const accessToken = bearer && bearer.split(' ')[1];
    if (accessToken === undefined) {
        res.sendStatus(401);
        return;
    }
    jsonwebtoken_1.default.verify(accessToken, JWT_SECRET, (err, user) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    });
};
exports.verifyAccessToken = verifyAccessToken;
const verifyRefreshToken = (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken === undefined) {
        res.sendStatus(401);
        return;
    }
    jsonwebtoken_1.default.verify(refreshToken, JWT_SECRET, (err, user) => {
        if (err) {
            res.sendStatus(403);
            return;
        }
        req.user = user;
        next();
    });
};
exports.verifyRefreshToken = verifyRefreshToken;
//# sourceMappingURL=auth.js.map