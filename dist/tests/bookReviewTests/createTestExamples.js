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
const bookModel_1 = __importDefault(require("../../model/bookModel"));
const bookReviewModel_1 = __importDefault(require("../../model/bookReviewModel"));
const createBook = (ID, title, author, year, language) => {
    return {
        ID,
        title,
        author,
        year,
        language
    };
};
const createBookReview = (ID, content, bookId, rating, username, userId) => {
    return {
        ID,
        content,
        bookId,
        rating,
        username,
        userId
    };
};
const createTestExamples = () => __awaiter(void 0, void 0, void 0, function* () {
    bookModel_1.default.addBook(createBook("123456789", "The Great Gatsby", "F. Scott Fitzgerald", 1925, "English"));
    bookModel_1.default.addBook(createBook("234567890", "War and Peace", "Leo Tolstoy", 1869, "Russian"));
    bookModel_1.default.addBook(createBook("345678901", "Pride and Prejudice", "Jane Austen", 1813, "English"));
    bookReviewModel_1.default.addBookReview(createBookReview("123456789", "Great book", (yield bookModel_1.default.getBooks())[0].ID, 5, "John", "123456789"));
    bookReviewModel_1.default.addBookReview(createBookReview("234567890", "Not a great book", (yield bookModel_1.default.getBooks())[0].ID, 2, "Jane", "234567890"));
    bookReviewModel_1.default.addBookReview(createBookReview("345678901", "I loved it", (yield bookModel_1.default.getBooks())[1].ID, 4, "Alice", "345678901"));
});
exports.default = createTestExamples;
