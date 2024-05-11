import {Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null){res.status(401).json("Token doesn't exist"); return;} // if there isn't any token}

  jwt.verify(token, process.env.SECRET_JWT_KEY!, (err: any, user: any) => {
    if (err) return res.status(401).json("Token is expired");
    next(); // pass the execution off to whatever request the client intended
  });
};