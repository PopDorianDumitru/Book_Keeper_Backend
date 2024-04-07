import validBook from "../validators/bookValidator";
import { Request, Response } from "express";
import bookList from "../model/bookModel";
import { randomUUID } from "crypto";
import { error } from "console";
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
      console.log("Error adding book")
      res.status(400).json(err.message);
      return;
    }
}
export default createNewBook