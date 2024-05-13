"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBook = exports.getBookById = exports.getAllBooks = exports.deleteBookById = exports.createNewBook = void 0;
const bookValidator_1 = __importDefault(require("../validators/bookValidator"));
const bookModel_1 = __importDefault(require("../model/bookModel"));
const crypto_1 = require("crypto");
const createNewBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Trying to add book");
    let book = req.body;
    try {
        (0, bookValidator_1.default)(book);
        book.ID = (0, crypto_1.randomUUID)();
        yield bookModel_1.default.addBook(book);
        console.log("Book added");
        res.status(201).json(book);
    }
    catch (err) {
        console.log(err);
        res.status(400).json(err.message);
        return;
    }
});
exports.createNewBook = createNewBook;
const deleteBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        if (!id)
            throw new Error("ID is required");
        yield bookModel_1.default.removeBook(id);
        res.status(204).send();
    }
    catch (err) {
        res.status(404).send(err.message);
        return;
    }
});
exports.deleteBookById = deleteBookById;
const getAllBooks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const page = req.query.page;
    if (Object.keys(req.query).length === 0)
        res.json(yield bookModel_1.default.getBooks()).status(200);
    else if (Object.keys(req.query).length === 1 && page) {
        try {
            const pg = parseInt(page);
            res.json(yield bookModel_1.default.getBooks(pg)).status(200);
        }
        catch (err) {
            res.status(400).send(err.message);
        }
    }
    else {
        try {
            const _a = req.query, { page } = _a, queryParams = __rest(_a, ["page"]);
            const pg = parseInt(page);
            res.json(yield bookModel_1.default.getBooksOrdered(queryParams, pg)).status(200);
        }
        catch (err) {
            res.status(400).send(err.message);
        }
    }
});
exports.getAllBooks = getAllBooks;
const getBookById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        if (!id)
            throw new Error("ID is required");
        const book = yield bookModel_1.default.getBook(id);
        res.json(book).status(200);
    }
    catch (err) {
        res.status(404).send(err.message);
        return;
    }
});
exports.getBookById = getBookById;
const updateBook = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedFields = req.body;
    try {
        if (!id)
            throw new Error("ID is required");
        if (!updatedFields)
            throw new Error("Updated fields are required");
        const book = yield bookModel_1.default.getBook(id);
        const newBook = Object.assign(Object.assign({}, book), updatedFields);
        console.log(updatedFields);
        (0, bookValidator_1.default)(newBook);
        if (book.ID !== newBook.ID)
            throw new Error("Book ID cannot be changed");
        yield bookModel_1.default.updateBookFields(id, updatedFields);
        res.status(200).json(newBook);
    }
    catch (err) {
        res.status(404).send(err.message);
        return;
    }
});
exports.updateBook = updateBook;
