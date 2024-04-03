import {Request, Response} from 'express';
import bookList from '../model/bookModel';

const getBookById = (req: Request, res: Response) => {
    const id = req.params.id;
    const book = bookList.find(b => b.ID === id);
    if (!book) {
      res.status(404).send("Book not found");
      return;
    }
    res.json(book).status(200);
}
export default getBookById;