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
exports.getBookReviewsWithBookId = exports.updateBookReviewFields = exports.getBookReviews = exports.getBookReview = exports.removeBookReview = exports.addBookReview = exports.bookReviewList = exports.getBookRatingSum = exports.getBookRatingCount = void 0;
const getBookRatingCount = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.bookReviewList.filter(b => b.bookId === bookId).length;
});
exports.getBookRatingCount = getBookRatingCount;
const getBookRatingSum = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    return exports.bookReviewList.filter(b => b.bookId === bookId).reduce((acc, b) => acc + b.rating, 0);
});
exports.getBookRatingSum = getBookRatingSum;
exports.bookReviewList = [];
const addBookReview = (bookReview) => __awaiter(void 0, void 0, void 0, function* () {
    exports.bookReviewList.push(bookReview);
});
exports.addBookReview = addBookReview;
const removeBookReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const index = exports.bookReviewList.findIndex(b => b.ID === id);
    if (index !== -1) {
        exports.bookReviewList.splice(index, 1);
    }
    else {
        throw new Error("Book review not found");
    }
    // const result = await pool.query('DELETE FROM public."bookReviewsTable" WHERE "ID" = $1', [id]);
    // if (result.rowCount === 0) {
    //     throw new Error("Book review not found");
    // }
});
exports.removeBookReview = removeBookReview;
const getBookReview = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const bookReview = exports.bookReviewList.find(b => b.ID === id);
    if (!bookReview)
        throw new Error("Book review not found");
    return bookReview;
    // const bookRow = await pool.query('SELECT * FROM public."bookReviewsTable" WHERE "ID" = $1', [id]);
    // if(bookRow.rowCount === 0)
    //     throw new Error("Book review not found");
    // return bookRow.rows[0];
});
exports.getBookReview = getBookReview;
const getBookReviews = () => __awaiter(void 0, void 0, void 0, function* () {
    return exports.bookReviewList;
});
exports.getBookReviews = getBookReviews;
const updateBookReviewFields = (id, updatedFields) => __awaiter(void 0, void 0, void 0, function* () {
    const index = exports.bookReviewList.findIndex(b => b.ID === id);
    if (index !== -1) {
        let bookReview = Object.assign(Object.assign({}, exports.bookReviewList[index]), updatedFields);
        exports.bookReviewList[index] = bookReview;
        return bookReview;
    }
    throw new Error("Book review not found");
});
exports.updateBookReviewFields = updateBookReviewFields;
const getBookReviewsWithBookId = (bookId) => __awaiter(void 0, void 0, void 0, function* () {
    const bookReviews = exports.bookReviewList.filter(b => b.bookId === bookId);
    return bookReviews;
});
exports.getBookReviewsWithBookId = getBookReviewsWithBookId;
exports.default = { addBookReview: exports.addBookReview, removeBookReview: exports.removeBookReview, getBookReview: exports.getBookReview, getBookReviews: exports.getBookReviews, getBookRatingCount: exports.getBookRatingCount, getBookRatingSum: exports.getBookRatingSum, updateBookReviewFields: exports.updateBookReviewFields, getBookReviewsWithBookId: exports.getBookReviewsWithBookId };
