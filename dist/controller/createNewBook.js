"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookValidator_1 = __importDefault(require("../validators/bookValidator"));
const bookModel_1 = __importDefault(require("../model/bookModel"));
const createNewBook = (req, res) => {
    console.log("Trying to add book");
    let book = req.body;
    try {
        (0, bookValidator_1.default)(book);
        bookModel_1.default.push(book);
        console.log("Book added");
        res.status(201).json(book);
    }
    catch (err) {
        res.status(400).send(err.message);
        return;
    }
};
exports.default = createNewBook;
