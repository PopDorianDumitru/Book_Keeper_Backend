"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookReviewInMemoryModel_1 = __importDefault(require("./bookReviewInMemoryModel"));
const bookReviewPostgresModel_1 = __importDefault(require("./bookReviewPostgresModel"));
exports.default = process.env.NODE_ENV === "test" ? bookReviewInMemoryModel_1.default : bookReviewPostgresModel_1.default;
