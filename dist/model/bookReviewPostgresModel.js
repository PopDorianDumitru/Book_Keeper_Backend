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
exports.getBookReviewsWithBookId = exports.updateBookReviewFields = exports.getBookReviews = exports.getBookReview = exports.removeBookReview = exports.addBookReview = exports.getBookRatingSum = exports.getBookRatingCount = exports.bookReviewList = void 0;
const postgresDatabase_1 = __importDefault(require("../database/postgresDatabase"));
exports.bookReviewList = [];
const getBookRatingCount = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('SELECT * FROM public."bookReviewsTable" WHERE "bookId" = $1', [bookId]);
    return result.rows.length;
});
exports.getBookRatingCount = getBookRatingCount;
const getBookRatingSum = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('SELECT SUM(rating ) FROM public."bookReviewsTable" WHERE "bookId" = $1', [bookId]);
    console.log(Number.parseInt(result.rows[0]['sum']));
    return Number.parseInt(result.rows[0]['sum']);
});
exports.getBookRatingSum = getBookRatingSum;
const addBookReview = (bookReview) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield postgresDatabase_1.default.query('INSERT INTO public."bookReviewsTable" ("ID", content, "bookId", rating, username, "userId") VALUES($1, $2, $3, $4, $5, $6)', [bookReview.ID, bookReview.content, bookReview.bookId, bookReview.rating, bookReview.username, bookReview.userId]);
    if (result.rowCount === 0)
        throw new Error("Book review not added");
    // bookReviewList.push(bookReview);
});
exports.addBookReview = addBookReview;
const removeBookReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const index = bookReviewList.findIndex(b => b.ID === id);
    // if (index !== -1) {
    //     bookReviewList.splice(index, 1);
    // }
    // else {
    //     throw new Error("Book review not found");
    // }
    const result = yield postgresDatabase_1.default.query('DELETE FROM public."bookReviewsTable" WHERE "ID" = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error("Book review not found");
    }
});
exports.removeBookReview = removeBookReview;
const getBookReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    // const bookReview =  bookReviewList.find(b => b.ID === id);
    // if(!bookReview)
    //     throw new Error("Book review not found");
    // return bookReview;
    const bookRow = yield postgresDatabase_1.default.query('SELECT * FROM public."bookReviewsTable" WHERE "ID" = $1', [id]);
    if (bookRow.rowCount === 0)
        throw new Error("Book review not found");
    return bookRow.rows[0];
});
exports.getBookReview = getBookReview;
const getBookReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    return (yield postgresDatabase_1.default.query('SELECT * FROM public."bookReviewsTable";')).rows;
});
exports.getBookReviews = getBookReviews;
const updateBookReviewFields = (id, updatedFields) => __awaiter(void 0, void 0, void 0, function* () {
    // const index = bookReviewList.findIndex(b => b.ID === id);
    // if (index !== -1) {
    //     let bookReview = {...bookReviewList[index], ...updatedFields};
    //     bookReviewList[index] = bookReview;
    //     return bookReview;
    // }
    // throw new Error("Book review not found");
    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    if (keys.length === 0)
        throw new Error("No fields to update");
    let query = 'UPDATE public."bookReviewsTable" SET ';
    for (let i = 0; i < keys.length; i++) {
        query += keys[i] + ' = $' + (i + 1) + ', ';
    }
    query = query.slice(0, -2);
    query += ' WHERE "ID" = $' + (keys.length + 1);
    console.log(query);
    const result = yield postgresDatabase_1.default.query(query, [...values, id]);
    if (result.rowCount === 0)
        throw new Error("Book review not found");
});
exports.updateBookReviewFields = updateBookReviewFields;
const getBookReviewsWithBookId = (bookId_1, ...args_1) => __awaiter(void 0, [bookId_1, ...args_1], void 0, function* (bookId, page = -1) {
    if (page > -1) {
        const result = yield postgresDatabase_1.default.query('SELECT * FROM public."bookReviewsTable" WHERE "bookId" = $1 LIMIT $2 OFFSET $3', [bookId, 5, page * 5]);
        return result.rows;
    }
    const result = yield postgresDatabase_1.default.query('SELECT * FROM public."bookReviewsTable" WHERE "bookId" = $1', [bookId]);
    return result.rows;
});
exports.getBookReviewsWithBookId = getBookReviewsWithBookId;
exports.default = { addBookReview: exports.addBookReview, removeBookReview: exports.removeBookReview, getBookReview: exports.getBookReview, getBookReviews: exports.getBookReviews, updateBookReviewFields: exports.updateBookReviewFields, getBookReviewsWithBookId: exports.getBookReviewsWithBookId, getBookRatingCount: exports.getBookRatingCount, getBookRatingSum: exports.getBookRatingSum };
