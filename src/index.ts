import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import { getAllBooks, getBookById, createNewBook, deleteBookById, updateBook } from "./controller/bookController";

import cors from "cors";
import webSocket from './sockets/socket';
import "./cronjob/reviewGenerator"

import { getAllBookReviews, getBookReviewById, getBookReviewsByBookId, createNewBookReview, deleteBookReviewById, updateBookReview } from "./controller/bookReviewController";
dotenv.config();
const app: Express = express();
const port = process.env.NODE_ENV === 'test' ? 0 : process.env.PORT || 3000;
if(process.env.NODE_ENV === 'test'){
  webSocket.close();
}
const jsonParser = bodyParser.json();
app.use(cors());

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server").status(200);
});

app.get("/books", getAllBooks);
app.get("/books/:id",  getBookById);

app.post("/books", jsonParser, createNewBook);

app.delete("/books/:id",deleteBookById);

app.patch("/books/:id", jsonParser, updateBook);

app.get("/reviews", getAllBookReviews);
app.get("/reviews/:id", getBookReviewById);
app.get("/reviews/book/:id", getBookReviewsByBookId);

app.post("/reviews", jsonParser, createNewBookReview);

app.delete("/reviews/:id", deleteBookReviewById);

app.patch("/reviews/:id", jsonParser, updateBookReview);


 

const server = app.listen(port  , () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});

export default server;