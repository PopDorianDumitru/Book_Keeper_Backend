"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) {
        res.status(401).json("Token doesn't exist");
        return;
    } // if there isn't any token}
    jsonwebtoken_1.default.verify(token, process.env.SECRET_JWT_KEY, (err, user) => {
        if (err)
            return res.status(401).json("Token is expired");
        next(); // pass the execution off to whatever request the client intended
    });
};
exports.authenticateToken = authenticateToken;
