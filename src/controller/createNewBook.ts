import validBook from "../validators/bookValidator";
import { Request, Response } from "express";
import bookList from "../model/bookModel";
import { randomUUID } from "crypto";
const createNewBook = (req: Request, res: Response) => {
    console.log("Trying to add book")
    let book = req.body;
    try{
      validBook(book);
      book.ID = randomUUID();
      bookList.push(book);
      console.log("Book added")
      res.status(201).json(book);
    }
    catch(err: any){
      res.status(400).send(err.message);
      return;
    }
}
export default createNewBook