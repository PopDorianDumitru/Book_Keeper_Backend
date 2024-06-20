import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import { getAllBooks, getBookById, createNewBook, deleteBookById, updateBook, answerBookQuestion, getBooksByTitle, getBooksByAuthorController, createNewStory, getSuggestion, getBookPicture } from "./controller/bookController";
import {authenticateToken} from './middleware/authenticate'
import cors from "cors";
import webSocket from './sockets/socket';
import "./cronjob/reviewGenerator"
import userController, { sendVerificationEmail } from "./controller/userController";
import { getAllBookReviews, getBookReviewById, getBookReviewsByBookId, createNewBookReview,getBookRating, deleteBookReviewById, updateBookReview } from "./controller/bookReviewController";
import cookieParser from "cookie-parser";
import { requireModerator } from "./middleware/requireModerator";
import { requireAdmin } from "./middleware/requireAdmin";
import adminController from "./controller/adminController";
import StartChattingSocket from "./sockets/messagesWebSocket";
import upload, {uploadPDF, getPDF, generatePicture} from "./controller/pdfbookController";
import path = require("path");
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
  res.send("Server is working").status(200);
});

app.get("/books", getAllBooks);
app.get("/books/:id", getBookById);

app.post("/books", jsonParser, authenticateToken, requireModerator, createNewBook);
app.post("/user-stories", jsonParser, authenticateToken, createNewStory);

app.delete("/books/:id", authenticateToken, requireModerator, deleteBookById);

app.patch("/books/:id", jsonParser, authenticateToken, requireModerator, updateBook);
app.get("/reviews/book/:id/rating", getBookRating);
app.get("/reviews", authenticateToken, getAllBookReviews);
app.get("/reviews/:id", authenticateToken, getBookReviewById);
app.get("/reviews/book/:id", authenticateToken, getBookReviewsByBookId);

app.post("/reviews", jsonParser, authenticateToken, createNewBookReview);
app.post("/verificationEmail", jsonParser, authenticateToken, sendVerificationEmail)
app.post("/verify", jsonParser, userController.verifyUser)
app.delete("/reviews/:id", authenticateToken, deleteBookReviewById);

app.patch("/reviews/:id", jsonParser, authenticateToken, updateBookReview);

app.get("/users", authenticateToken, requireAdmin, userController.getAllUsers);
app.get("/users/username/:username", authenticateToken, requireAdmin, userController.getUsersByUsername); 
app.get("/users/:id", authenticateToken, requireAdmin, userController.getUserById);

app.post("/users/profile", jsonParser, authenticateToken, userController.getUserByEmail)
app.post("/users", jsonParser, userController.addUser);
app.delete("/users/:id", authenticateToken, requireAdmin, userController.removeUserById);

app.post("/login", jsonParser, userController.logInUsingEmailAndPassword);


app.post("/refresh", jsonParser, userController.getAccessToken)
app.post("/authenticate", jsonParser, userController.authenticateUser)
app.delete("/logout", jsonParser, authenticateToken, userController.logOutUser)
app.post("/question", jsonParser, authenticateToken, answerBookQuestion);
app.patch("/moderator", jsonParser, authenticateToken, requireAdmin, adminController.registerModerator)

app.get('/pdfs/:id', jsonParser, authenticateToken, getPDF);

app.post('/upload', authenticateToken, requireModerator, upload.single('file'), uploadPDF);

app.get("/admin", authenticateToken, requireAdmin, adminController.confirmAdmin)

app.get("/title", authenticateToken, getBooksByTitle);
app.get("/author", getBooksByAuthorController);

app.post("/suggestion",jsonParser, authenticateToken, getSuggestion);
app.get("/photo/:id", jsonParser, authenticateToken, getBookPicture);
app.post("/generatePhoto", jsonParser, generatePicture);
StartChattingSocket();
const server = app.listen(port  , () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});



export default server;