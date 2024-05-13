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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateBookFields = exports.getBooksOrdered = exports.getBooks = exports.getBook = exports.removeBook = exports.addBook = exports.bookList = void 0;
exports.bookList = [];
const addBook = (book) => __awaiter(void 0, void 0, void 0, function* () {
    //bookList.push(book);
    exports.bookList.push(book);
});
exports.addBook = addBook;
const removeBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const index = bookList.findIndex(b => b.ID === id);
    let index = exports.bookList.findIndex(b => b.ID === id);
    if (index === -1) {
        throw new Error("Book not found");
    }
    exports.bookList.splice(index, 1);
});
exports.removeBook = removeBook;
const getBook = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const book =  bookList.find(b => b.ID === id);
    let index = exports.bookList.findIndex(b => b.ID === id);
    if (index === -1)
        throw new Error("Book not found");
    return exports.bookList[index];
});
exports.getBook = getBook;
const getBooks = () => __awaiter(void 0, void 0, void 0, function* () {
    return exports.bookList;
});
exports.getBooks = getBooks;
const getBooksOrdered = (parameters) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.bookList;
});
exports.getBooksOrdered = getBooksOrdered;
const updateBookFields = (id, updatedFields) => __awaiter(void 0, void 0, void 0, function* () {
    const index = exports.bookList.findIndex(b => b.ID === id);
    if (index !== -1) {
        let book = Object.assign(Object.assign({}, exports.bookList[index]), updatedFields);
        exports.bookList[index] = book;
        return book;
    }
    throw new Error("Book not found");
});
exports.updateBookFields = updateBookFields;
exports.default = { addBook: exports.addBook, removeBook: exports.removeBook, getBook: exports.getBook, getBooks: exports.getBooks, updateBookFields: exports.updateBookFields, getBooksOrdered: exports.getBooksOrdered };
