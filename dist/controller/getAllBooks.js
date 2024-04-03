"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookModel_1 = __importDefault(require("../model/bookModel"));
const getAllBooks = (req, res) => {
    res.json(bookModel_1.default).status(200).send();
};
exports.default = getAllBooks;
