"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b, _c, _d;
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
const pgmock2_1 = __importStar(require("pgmock2"));
dotenv_1.default.config();
const pool = new pg_1.Pool({
    user: (_a = process.env.POSTGRES_USERNAME) === null || _a === void 0 ? void 0 : _a.toString(),
    host: (_b = process.env.POSTGRES_HOST) === null || _b === void 0 ? void 0 : _b.toString(),
    database: (_c = process.env.POSTGRES_DATABASE) === null || _c === void 0 ? void 0 : _c.toString(),
    password: (_d = process.env.POSTGRES_PASSWORD) === null || _d === void 0 ? void 0 : _d.toString(),
    port: parseInt(process.env.POSTGRES_PORT),
    max: 20,
    idleTimeoutMillis: 30000,
});
const pg = new pgmock2_1.default();
const mockPool = (0, pgmock2_1.getPool)(pg);
exports.default = process.env.NODE_ENV === "test" ? mockPool : pool;
