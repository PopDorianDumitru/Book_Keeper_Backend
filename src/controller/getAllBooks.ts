import { Request, Response } from 'express';
import bookList from '../model/bookModel';
const getAllBooks = (req: Request, res: Response)=>{
    res.json(bookList).status(200).send();
}

export default getAllBooks;