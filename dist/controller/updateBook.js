"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookModel_1 = __importDefault(require("../model/bookModel"));
const bookValidator_1 = __importDefault(require("../validators/bookValidator"));
const updateBook = (req, res) => {
    const id = req.params.id;
    const index = bookModel_1.default.findIndex(b => b.ID === id);
    if (index === -1) {
        res.status(404).send("Book not found");
        return;
    }
    let updatedFields = req.body;
    try {
        let book = Object.assign(Object.assign({}, bookModel_1.default[index]), updatedFields);
        (0, bookValidator_1.default)(book);
        bookModel_1.default[index] = book;
        res.status(200).json(book);
    }
    catch (err) {
        res.status(400).send(err.message);
        return;
    }
};
exports.default = updateBook;
