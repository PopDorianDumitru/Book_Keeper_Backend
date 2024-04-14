import { Request, Response } from "express";
import bookReviewList from "../../model/bookReviewModel";


const deleteBookReviewById =  (req: Request, res: Response) => {
    const id = req.params.id;
    const index = bookReviewList.findIndex(b => b.ID === id);
    if (index === -1) {
      res.status(404).send("Book review not found");
      return;
    }
    bookReviewList.splice(index, 1);
    res.status(204).send();
}
export default deleteBookReviewById;