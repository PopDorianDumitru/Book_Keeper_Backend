import {Request, Response} from 'express';
import bookList from '../../model/bookModel';
import validBook from '../../validators/bookValidator';
const updateBook = (req: Request, res: Response) => {
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
export default updateBook