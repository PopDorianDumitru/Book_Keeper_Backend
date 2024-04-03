"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookModel_1 = __importDefault(require("../model/bookModel"));
const getBookById = (req, res) => {
    const id = req.params.id;
    const book = bookModel_1.default.find(b => b.ID === id);
    if (!book) {
        res.status(404).send("Book not found");
        return;
    }
    res.json(book).status(200);
};
exports.default = getBookById;
