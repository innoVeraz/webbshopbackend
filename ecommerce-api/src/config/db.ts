// Import and access enironmental variables
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
dotenv.config()

const ssl = process.env.AIVEN_CA_CERT
  ? { ca: process.env.AIVEN_CA_CERT }
  : undefined;

// Databasanslutningskonfiguration med optimal molnstöd
export const db = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     parseInt(process.env.DB_PORT || "3306"),
  charset:  'utf8mb4',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0, // Obegränsad kö
  enableKeepAlive: true,
  keepAliveInitialDelay: 10000, // 10 sekunder
  ssl
})

export const connectDB = async () => {
  try {
    const connection = await db.getConnection()
    await connection.query('SET NAMES utf8mb4')
    await connection.release() // Viktigt för att frigöra anslutningen tillbaka till poolen
    console.log('Ansluten till databasen')
  } catch(error) {
    console.error('Databasanslutningsfel:', error)
    // Vid produktion, kan du överväga att skicka felmeddelanden till en loggningsservice
    if (process.env.NODE_ENV === "production") {
      // I produktion kan man undvika att visa för detaljerade felmeddelanden
      console.error('Kunde inte ansluta till databasen i produktionsmiljö')
    }
  }
}
