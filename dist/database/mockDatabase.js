"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pg = void 0;
const pgmock2_1 = require("pgmock2");
const pgmock2_2 = __importDefault(require("pgmock2"));
exports.pg = new pgmock2_2.default();
const mockPool = (0, pgmock2_1.getPool)(exports.pg);
exports.default = mockPool;
