import { Request, Response } from 'express';
import bookReviewList from '../../model/bookReviewModel';

const getBookReviewById = (req: Request, res: Response) => {
    const id = req.params.id;
    let bookReview = bookReviewList.find(b => b.ID === id);
    if(!bookReview){
        res.status(404).send("Book Review not found");
        return;
    }
    res.json(bookReview).status(200);

}

export default getBookReviewById;