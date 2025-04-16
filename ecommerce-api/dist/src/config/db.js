"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.db = void 0;
// Import and access enironmental variables
const dotenv_1 = __importDefault(require("dotenv"));
const promise_1 = __importDefault(require("mysql2/promise"));
dotenv_1.default.config();
// Databasanslutningskonfiguration med optimal molnstöd
exports.db = promise_1.default.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || "3306"),
    charset: 'utf8mb4',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0, // Obegränsad kö
    enableKeepAlive: true,
    keepAliveInitialDelay: 10000 // 10 sekunder
});
const connectDB = async () => {
    try {
        const connection = await exports.db.getConnection();
        await connection.query('SET NAMES utf8mb4');
        await connection.release(); // Viktigt för att frigöra anslutningen tillbaka till poolen
        console.log('Ansluten till databasen');
    }
    catch (error) {
        console.error('Databasanslutningsfel:', error);
        // Vid produktion, kan du överväga att skicka felmeddelanden till en loggningsservice
        if (process.env.NODE_ENV === "production") {
            // I produktion kan man undvika att visa för detaljerade felmeddelanden
            console.error('Kunde inte ansluta till databasen i produktionsmiljö');
        }
    }
};
exports.connectDB = connectDB;
//# sourceMappingURL=db.js.map