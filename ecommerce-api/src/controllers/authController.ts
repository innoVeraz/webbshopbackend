import { db } from "../config/db";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Request, RequestExtended, Response } from 'express';

import { logError } from "../utilities/logger";
import { ResultSetHeader } from "mysql2";
import { IUser } from "../models/IUser";

// Säkerställ att JWT-secret finns
const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'fallback_secret_for_development';

export const login = async (req: Request, res: Response): Promise<void> => {
  let user: IUser | null = null;
  const { username, password} = req.body;
  
  if (username === undefined || password === undefined) {
    res.status(400).json({success: false, message: "Missing required fields (username/password)"});
    return;
  }    

  try {
    const sql = "SELECT * FROM users WHERE username = ?";
    const [rows] = await db.query<IUser[]>(sql, [username])
    
    if (rows && rows.length > 0) {
      user = rows[0];
    } else {
      res.status(404).json({success: false, message: 'User not found'});
      return;
    }

    if (user && await bcrypt.compare(password.toString(), user.password)) {
      const userInfo = {
          username: user.username,
          created_at: user.created_at,
      }
      
      const refreshToken = jwt.sign(userInfo, JWT_SECRET, {expiresIn: '7d'});
      res.cookie('refreshToken', refreshToken, {
          httpOnly: true,
          secure: false,
          sameSite: 'none',
          maxAge: 1000 * 60 * 60 * 24 * 7,
          path: '/auth/refresh-token'
      });
      
      const accessToken = jwt.sign(userInfo, JWT_SECRET, {expiresIn: '15m'});
      res.json({
        success: true,
        user: {username: userInfo.username},
        expires_in: 60 * 15,
        token: accessToken
      });
      return;
    } else {
      res.status(401).json({success: false, message: "Incorrect user credentials"});
      return;
    }  
  } catch (error) {
    res.status(500).json({error: logError(error)})
  }
}


export const refreshToken = async (req: RequestExtended, res: Response): Promise<void> => {
  try {
    const userInfo = {
        username: req.user.username,
        created_at: req.user.created_at,
    }
    const refreshToken = jwt.sign(userInfo, JWT_SECRET, {expiresIn: '7d'});
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, 
        path: '/auth/refresh-token'
    });
    const accessToken = jwt.sign(userInfo, JWT_SECRET, {expiresIn: '15m'});

    res.json({
      user: {username: userInfo.username},
      expires_in: 60 * 15, 
      token: accessToken
    });
  } catch(error) {
    res.status(500).json({error: logError(error)})
  }
}


export const clearToken = async (req: Request, res: Response): Promise<void> => {  
  try {
      res.clearCookie('refreshToken', { path: '/auth/refresh-token'});
      res.json({success: true, message: 'Token cleared'});
  }
  catch(error) {
      res.json({success: false, message: error});
  }
}

export const register = async (req: Request, res: Response): Promise<void> => {  
  const { username, password} = req.body;
  if (username === undefined || password === undefined) {
    res.status(400).json({success: false, message: "Missing required fields (username/password)"});
    return 
  }
  
  try {
    const hashedPassword = await bcrypt.hash(password.toString(), 10);
    const sql = `
      INSERT INTO users (username, password)
      VALUES (?, ?)
    `;
    const params = [username, hashedPassword]
    await db.query<ResultSetHeader>(sql, params)

    res.status(201).json({success: true, message: 'User registered', user: {
      username: username
    }});
  } catch(error: unknown) {
    res.status(500).json({error: logError(error)})
  }
}