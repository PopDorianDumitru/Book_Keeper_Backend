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
exports.updateBookReview = exports.getBookReviewsByBookId = exports.getBookReviewById = exports.getBookRating = exports.getAllBookReviews = exports.deleteBookReviewById = exports.createNewBookReview = void 0;
const bookReviewModel_1 = __importDefault(require("../model/bookReviewModel"));
const bookReviewValidator_1 = __importDefault(require("../validators/bookReviewValidator"));
const bookModel_1 = __importDefault(require("../model/bookModel"));
const crypto_1 = require("crypto");
const createNewBookReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let bookReview = req.body;
    try {
        bookReview.ID = (0, crypto_1.randomUUID)();
        (0, bookReviewValidator_1.default)(bookReview);
        yield bookModel_1.default.getBook(bookReview.bookId);
        yield bookReviewModel_1.default.addBookReview(bookReview);
        console.log(bookReview);
        res.status(201).send(bookReview);
    }
    catch (err) {
        res.status(400).send(err.message);
        return;
    }
});
exports.createNewBookReview = createNewBookReview;
const deleteBookReviewById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        if (!id)
            throw new Error("ID is required");
        yield bookReviewModel_1.default.removeBookReview(id);
        res.status(204).send();
    }
    catch (err) {
        res.status(404).send(err.message);
    }
});
exports.deleteBookReviewById = deleteBookReviewById;
const getAllBookReviews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(yield bookReviewModel_1.default.getBookReviews()).status(200);
});
exports.getAllBookReviews = getAllBookReviews;
const getBookRating = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    try {
        if (!bookId)
            throw new Error("Book ID is required");
        const nrOfReviews = yield bookReviewModel_1.default.getBookRatingCount(bookId);
        console.log(nrOfReviews);
        if (nrOfReviews === 0) {
            res.status(200).json({ rating: "No ratings yet" });
            return;
        }
        if (isNaN(nrOfReviews)) {
            res.status(200).json({ rating: "No ratings yet" });
            return;
        }
        const ratingSum = yield bookReviewModel_1.default.getBookRatingSum(bookId);
        const rating = ratingSum / nrOfReviews;
        res.json({ rating: rating }).status(200);
    }
    catch (err) {
        res.status(400).send(err.message);
        return;
    }
});
exports.getBookRating = getBookRating;
const getBookReviewById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        if (!id)
            throw new Error("ID is required");
        const bookReview = yield bookReviewModel_1.default.getBookReview(id);
        res.json(bookReview).status(200);
    }
    catch (err) {
        res.status(404).send(err.message);
        return;
    }
});
exports.getBookReviewById = getBookReviewById;
const getBookReviewsByBookId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.id;
    const page = req.query.page;
    if (Object.keys(req.query).length === 1 && page) {
        console.log("Got here", page);
        try {
            const pg = parseInt(page);
            res.json(yield bookReviewModel_1.default.getBookReviewsWithBookId(bookId, pg)).status(200);
        }
        catch (err) {
            res.status(400).send(err.message);
        }
        return;
    }
    const bookReviews = yield bookReviewModel_1.default.getBookReviewsWithBookId(bookId);
    res.json(bookReviews).status(200);
});
exports.getBookReviewsByBookId = getBookReviewsByBookId;
const updateBookReview = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const updatedFields = req.body;
    try {
        if (!id)
            throw new Error("ID is required");
        if (!updatedFields)
            throw new Error("Updated fields are required");
        const bookReview = yield bookReviewModel_1.default.getBookReview(id);
        const newBookReview = Object.assign(Object.assign({}, bookReview), updatedFields);
        (0, bookReviewValidator_1.default)(newBookReview);
        if (newBookReview.ID !== bookReview.ID)
            throw new Error("Book review ID cannot be changed");
        if (newBookReview.userId !== bookReview.userId)
            throw new Error("User ID cannot be changed");
        if (newBookReview.bookId !== bookReview.bookId)
            throw new Error("Book ID cannot be changed");
        if (newBookReview.username !== bookReview.username)
            throw new Error("Username cannot be changed");
        yield bookReviewModel_1.default.updateBookReviewFields(id, updatedFields);
        res.status(200).json(newBookReview);
    }
    catch (err) {
        if (err.message.includes("not found"))
            res.status(404).send(err.message);
        else
            res.status(400).send(err.message);
        return;
    }
});
exports.updateBookReview = updateBookReview;
