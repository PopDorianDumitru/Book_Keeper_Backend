import {Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { isAdmin } from '../model/userPostgresModel';

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null)
    {
        res.status(401).json("Token doesn't exist"); 
        return;
    }
    
    jwt.verify(token, process.env.SECRET_JWT_KEY!, async (err: any, user: any) => {
        if (err) return res.status(401).json("Token is expired");
        if(user.email === undefined)
            return res.status(403).json("You are not an admin");

        if(!(await isAdmin(user.email))) 
            return res.status(403).json("You are not an admin");
        next();
    });
};