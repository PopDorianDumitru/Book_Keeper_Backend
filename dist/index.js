"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const getAllBooks_1 = __importDefault(require("./controller/getAllBooks"));
const getBookById_1 = __importDefault(require("./controller/getBookById"));
const createNewBook_1 = __importDefault(require("./controller/createNewBook"));
const deleteBookById_1 = __importDefault(require("./controller/deleteBookById"));
const updateBook_1 = __importDefault(require("./controller/updateBook"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.NODE_ENV === 'test' ? 0 : process.env.PORT || 3000;
const jsonParser = body_parser_1.default.json();
app.get("/", (req, res) => {
    res.send("Express + TypeScript Server").status(200);
});
app.get("/books", getAllBooks_1.default);
app.get("/books/:id", getBookById_1.default);
app.post("/books", jsonParser, createNewBook_1.default);
app.delete("/books/:id", deleteBookById_1.default);
app.patch("/books/:id", jsonParser, updateBook_1.default);
const server = app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
exports.default = server;
