"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bookModel_1 = __importDefault(require("../model/bookModel"));
const deleteBookById = (req, res) => {
    const id = req.params.id;
    const index = bookModel_1.default.findIndex(b => b.ID === id);
    if (index === -1) {
        res.status(404).send("Book not found");
        return;
    }
    bookModel_1.default.splice(index, 1);
    res.status(204).send();
};
exports.default = deleteBookById;
