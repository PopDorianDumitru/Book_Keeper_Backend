"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookInMemoryModel_1 = __importDefault(require("./bookInMemoryModel"));
const bookPostgresModel_1 = __importDefault(require("./bookPostgresModel"));
exports.default = process.env.NODE_ENV === "test" ? bookInMemoryModel_1.default : bookPostgresModel_1.default;
