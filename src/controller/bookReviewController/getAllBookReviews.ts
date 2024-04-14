import { Request, Response } from "express";
import bookReviewList from "../../model/bookReviewModel";

const getAllBookReviews =  (req: Request, res: Response) => {
    res.json(bookReviewList).status(200);
}

export default getAllBookReviews;  