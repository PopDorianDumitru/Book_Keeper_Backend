"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const validBook = (book) => {
    if (book.title.length < 2)
        throw new Error("Title must be at least 2 characters long");
    if (book.author.length < 2)
        throw new Error("Author must be at least 2 characters long");
    if (book.language.length < 2)
        throw new Error("Language must be at least 2 characters long");
    if (book.year < 0 || book.year > new Date().getFullYear() + 5)
        throw new Error("Year must be between 0 and " + (new Date().getFullYear() + 5));
    return true;
};
exports.default = validBook;
