import {Request, Response} from 'express';
import bookList from '../model/bookModel';


const deleteBookById =(req:Request, res:Response) =>{
    const id = req.params.id;
    const index = bookList.findIndex(b => b.ID === id);
    if (index === -1) {
      res.status(404).send("Book not found");
      return;
    }
    bookList.splice(index, 1);
    res.status(204).send();
}

export default deleteBookById