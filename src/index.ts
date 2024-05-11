import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";

import { getAllBooks, getBookById, createNewBook, deleteBookById, updateBook } from "./controller/bookController";
import {authenticateToken} from './middleware/authenticate'
import cors from "cors";
import webSocket from './sockets/socket';
import "./cronjob/reviewGenerator"
import userController, { sendVerificationEmail } from "./controller/userController";
import { getAllBookReviews, getBookReviewById, getBookReviewsByBookId, createNewBookReview,getBookRating, deleteBookReviewById, updateBookReview } from "./controller/bookReviewController";
import cookieParser from "cookie-parser";
dotenv.config();
const app: Express = express();
const port = process.env.NODE_ENV === 'test' ? 0 : process.env.PORT || 3000;
if(process.env.NODE_ENV === 'test'){
  webSocket.close();
}
const jsonParser = bodyParser.json();
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}));
app.use(cookieParser())
app.get("/", (req: Request, res: Response) => {
  res.send("Server working").status(200);
});

app.get("/books", getAllBooks);
app.get("/books/:id",  getBookById);

app.post("/books", jsonParser,authenticateToken, createNewBook);

app.delete("/books/:id", authenticateToken,deleteBookById);

app.patch("/books/:id", jsonParser, authenticateToken, updateBook);
app.get("/reviews/book/:id/rating", getBookRating);
app.get("/reviews", getAllBookReviews);
app.get("/reviews/:id", getBookReviewById);
app.get("/reviews/book/:id", getBookReviewsByBookId);

app.post("/reviews", jsonParser, authenticateToken, createNewBookReview);
app.post("/verificationEmail", jsonParser, authenticateToken, sendVerificationEmail)
app.post("/verify", jsonParser, userController.verifyUser)
app.delete("/reviews/:id", authenticateToken, deleteBookReviewById);

app.patch("/reviews/:id", jsonParser, authenticateToken, updateBookReview);

app.get("/users", userController.getAllUsers);
app.get("/users/username/:username", userController.getUsersByUsername); 
app.get("/users/:id", userController.getUserById);

app.post("/users/profile", jsonParser, authenticateToken, userController.getUserByEmail)
app.post("/users", jsonParser, userController.addUser);
app.delete("/users/:id", authenticateToken, userController.removeUserById);

app.post("/login", jsonParser, userController.logInUsingEmailAndPassword);


app.post("/refresh", jsonParser, userController.getAccessToken)
app.post("/authenticate", jsonParser, userController.authenticateUser)
app.delete("/logout", jsonParser, authenticateToken, userController.logOutUser)
const server = app.listen(port  , () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});



export default server;