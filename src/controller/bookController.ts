import validBook from "../validators/bookValidator";
import { Request, Response } from "express";
import bookModel from "../model/bookModel";
import { randomUUID } from "crypto";


export const createNewBook = async (req: Request, res: Response) => {
    console.log("Trying to add book")
    let book = req.body;
    try{
      validBook(book);
      book.ID = randomUUID();
      await bookModel.addBook(book);
      console.log("Book added")
      res.status(201).json(book);
    }
    catch(err: any){
      console.log(err)

      res.status(400).json(err.message);
      return;
    }
}


export const deleteBookById = async(req:Request, res:Response) =>{
    const id = req.params.id;
    try{
      if(!id)
        throw new Error("ID is required");
        await bookModel.removeBook(id);
        res.status(204).send();

    }
    catch(err: any){
      res.status(404).send(err.message);
      return;
    }
}


export const getAllBooks =async (req: Request, res: Response)=>{
    const page = req.query.page;
    if(Object.keys(req.query).length === 0)
      res.json(await bookModel.getBooks()).status(200);
    else
    if(Object.keys(req.query).length === 1 && page)
    {
  
      try{
        const pg = parseInt(page as string);
        res.json(await bookModel.getBooks(pg)).status(200);
      }
      catch(err: any){
        res.status(400).send(err.message);
      }
    }
    else{
      try{
        const {page, ...queryParams} = req.query;
        const pg = parseInt(page as string);
        res.json(await bookModel.getBooksOrdered(queryParams, pg)).status(200);
      }
      catch(err: any){
        res.status(400).send(err.message);
      }
    }
}

export const getBookById = async (req: Request, res: Response) => {
    const id = req.params.id;

    try{
      if(!id)
        throw new Error("ID is required");
      const book = await  bookModel.getBook(id);
      res.json(book).status(200);
    }
    catch(err: any){
      res.status(404).send(err.message);
      return;
    }
    
}

export const updateBook = async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedFields = req.body;
    try{
      if(!id)
        throw new Error("ID is required");
      if(!updatedFields)
        throw new Error("Updated fields are required");
      const book = await bookModel.getBook(id);
      const newBook = {...book, ...updatedFields};
      console.log(updatedFields);
      validBook(newBook);
      if(book.ID !== newBook.ID)
        throw new Error("Book ID cannot be changed");
      await bookModel.updateBookFields(id, updatedFields);
      res.status(200).json(newBook);

    }
    catch(err: any){
      res.status(404).send(err.message);
      return;
    }
   
}