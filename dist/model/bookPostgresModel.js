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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBooksOrdered = exports.updateBookFields = exports.getBooks = exports.getBook = exports.removeBook = exports.addBook = exports.bookList = void 0;
const postgresDatabase_1 = __importDefault(require("../database/postgresDatabase"));
exports.bookList = [];
const addBook = (book) => __awaiter(void 0, void 0, void 0, function* () {
    //bookList.push(book);
    const result = yield postgresDatabase_1.default.query('INSERT INTO public."booksTable" ("ID", title, author, language, year) VALUES ($1, $2, $3, $4, $5)', [book.ID, book.title, book.author, book.language, book.year]);
    if (result.rowCount === 0)
        throw new Error("Book not added");
});
exports.addBook = addBook;
const removeBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const index = bookList.findIndex(b => b.ID === id);
    const result = yield postgresDatabase_1.default.query('DELETE FROM public."booksTable" WHERE "ID" = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error("Book not found");
    }
});
exports.removeBook = removeBook;
const getBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const book =  bookList.find(b => b.ID === id);
    const bookRow = yield postgresDatabase_1.default.query('SELECT * FROM public."booksTable" WHERE "ID" = $1', [id]);
    if (bookRow.rowCount === 0)
        throw new Error("Book not found");
    return bookRow.rows[0];
});
exports.getBook = getBook;
const getBooks = (...args_1) => __awaiter(void 0, [...args_1], void 0, function* (page = -1) {
    if (page > -1) {
        return (yield postgresDatabase_1.default.query('SELECT "ID", title, author, language, year FROM public."booksTable" LIMIT $1 OFFSET $2', [50, page * 50])).rows;
    }
    return (yield postgresDatabase_1.default.query('SELECT "ID", title, author, language, year FROM public."booksTable";')).rows;
});
exports.getBooks = getBooks;
const updateBookFields = (id, updatedFields) => __awaiter(void 0, void 0, void 0, function* () {
    // const index = bookList.findIndex(b => b.ID === id);
    // if (index !== -1) {
    //     let book = {...bookList[index], ...updatedFields};
    //     bookList[index] = book;
    //     return book;
    // }
    // throw new Error("Book not found");
    const validKeys = ['ID', 'title', 'author', 'language', 'year'];
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    if (keys.length === 0)
        throw new Error("No fields to update");
    let query = 'UPDATE public."booksTable" SET ';
    for (let i = 0; i < keys.length; i++) {
        if (!validKeys.includes(keys[i]))
            throw new Error("Not a valid field to update");
        query += keys[i] + ' = $' + (i + 1) + ', ';
    }
    query = query.slice(0, -2);
    query += ' WHERE "ID" = $' + (keys.length + 1);
    console.log(query);
    const result = yield postgresDatabase_1.default.query(query, [...values, id]);
    if (result.rowCount === 0) {
        throw new Error("Book not found");
    }
});
exports.updateBookFields = updateBookFields;
const getBooksOrdered = (queryParams_1, ...args_2) => __awaiter(void 0, [queryParams_1, ...args_2], void 0, function* (queryParams, page = -1) {
    const validKeys = ['ID', 'title', 'author', 'language', 'year'];
    let query = 'SELECT "ID", title, author, language, year FROM public."booksTable" ORDER BY ';
    let keys = Object.keys(queryParams);
    let values = Object.values(queryParams);
    for (let i = 0; i < keys.length; i++) {
        if (!validKeys.includes(keys[i]))
            throw new Error("Not a valid key to sort by");
        query += keys[i] + ' ' + values[i] + ', ';
    }
    query = query.slice(0, -2);
    if (page > -1) {
        query += ' LIMIT $1 OFFSET $2';
        return (yield postgresDatabase_1.default.query(query, [50, page * 50])).rows;
    }
    console.log(query);
    return (yield postgresDatabase_1.default.query(query)).rows;
});
exports.getBooksOrdered = getBooksOrdered;
exports.default = { addBook: exports.addBook, removeBook: exports.removeBook, getBook: exports.getBook, getBooks: exports.getBooks, updateBookFields: exports.updateBookFields, getBooksOrdered: exports.getBooksOrdered };
