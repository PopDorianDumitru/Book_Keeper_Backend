import validBook from "../validators/bookValidator";
import { Request, Response } from "express";
import bookList from "../model/bookModel";
import { randomUUID } from "crypto";

export const createNewBook = (req: Request, res: Response) => {
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


export const deleteBookById =(req:Request, res:Response) =>{
    const id = req.params.id;
    const index = bookList.findIndex(b => b.ID === id);
    if (index === -1) {
      res.status(404).send("Book not found");
      return;
    }
    bookList.splice(index, 1);
    res.status(204).send();
}


export const getAllBooks = (req: Request, res: Response)=>{
    res.json(bookList).status(200);
}

export const getBookById = (req: Request, res: Response) => {
    const id = req.params.id;
    const book = bookList.find(b => b.ID === id);
    if (!book) {
      res.status(404).send("Book not found");
      return;
    }
    res.json(book).status(200);
}

export const updateBook = (req: Request, res: Response) => {
    const id = req.params.id;
    const index = bookList.findIndex(b => b.ID === id);
    if (index === -1) {
      res.status(404).send("Book not found");
      return;
    }
    let updatedFields = req.body;
    try{
      let book = {...bookList[index], ...updatedFields};
      validBook(book);
      if(book.ID !== bookList[index].ID)
        throw new Error("Book ID cannot be changed");
      
      bookList[index] = book;
      res.status(200).json(book)
    } 
    catch(err: any){
      res.status(400).send(err.message);
      return;
    }
}