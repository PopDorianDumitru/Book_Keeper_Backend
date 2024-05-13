"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const bookController_1 = require("./controller/bookController");
const authenticate_1 = require("./middleware/authenticate");
const cors_1 = __importDefault(require("cors"));
const socket_1 = __importDefault(require("./sockets/socket"));
require("./cronjob/reviewGenerator");
const userController_1 = __importStar(require("./controller/userController"));
const bookReviewController_1 = require("./controller/bookReviewController");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.NODE_ENV === 'test' ? 0 : process.env.PORT || 3000;
if (process.env.NODE_ENV === 'test') {
    socket_1.default.close();
}
const jsonParser = body_parser_1.default.json();
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.get("/", (req, res) => {
    res.send("Server working").status(200);
});
app.get("/books", bookController_1.getAllBooks);
app.get("/books/:id", bookController_1.getBookById);
app.post("/books", jsonParser, authenticate_1.authenticateToken, bookController_1.createNewBook);
app.delete("/books/:id", authenticate_1.authenticateToken, bookController_1.deleteBookById);
app.patch("/books/:id", jsonParser, authenticate_1.authenticateToken, bookController_1.updateBook);
app.get("/reviews/book/:id/rating", bookReviewController_1.getBookRating);
app.get("/reviews", bookReviewController_1.getAllBookReviews);
app.get("/reviews/:id", bookReviewController_1.getBookReviewById);
app.get("/reviews/book/:id", bookReviewController_1.getBookReviewsByBookId);
app.post("/reviews", jsonParser, authenticate_1.authenticateToken, bookReviewController_1.createNewBookReview);
app.post("/verificationEmail", jsonParser, authenticate_1.authenticateToken, userController_1.sendVerificationEmail);
app.post("/verify", jsonParser, userController_1.default.verifyUser);
app.delete("/reviews/:id", authenticate_1.authenticateToken, bookReviewController_1.deleteBookReviewById);
app.patch("/reviews/:id", jsonParser, authenticate_1.authenticateToken, bookReviewController_1.updateBookReview);
app.get("/users", userController_1.default.getAllUsers);
app.get("/users/username/:username", userController_1.default.getUsersByUsername);
app.get("/users/:id", userController_1.default.getUserById);
app.post("/users/profile", jsonParser, authenticate_1.authenticateToken, userController_1.default.getUserByEmail);
app.post("/users", jsonParser, userController_1.default.addUser);
app.delete("/users/:id", authenticate_1.authenticateToken, userController_1.default.removeUserById);
app.post("/login", jsonParser, userController_1.default.logInUsingEmailAndPassword);
app.post("/refresh", jsonParser, userController_1.default.getAccessToken);
app.post("/authenticate", jsonParser, userController_1.default.authenticateUser);
app.delete("/logout", jsonParser, authenticate_1.authenticateToken, userController_1.default.logOutUser);
const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
exports.default = server;
