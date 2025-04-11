// Import and access enironmental variables
import dotenv from 'dotenv'
import mysql from 'mysql2/promise'
dotenv.config()

export const db = mysql.createPool({
  host:     process.env.DB_HOST,
  user:     process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port:     parseInt(process.env.DB_PORT || "3306"),
  charset:  'utf8mb4',
})

export const connectDB = async () => {
  try {
    const connection = await db.getConnection()
    await connection.query('SET NAMES utf8mb4') // 👈 lägg till detta
    console.log('Connected to DB')
  } catch(error) {
    console.log('Error connecting to DB: ' + error)
  }
}
