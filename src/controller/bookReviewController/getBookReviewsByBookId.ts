import { Request, Response } from "express";
import bookReviewList from "../../model/bookReviewModel";



const getBookReviewsByBookId = async (req: Request, res: Response) => {
    const bookId = req.params.id;
    const bookReviews = bookReviewList.filter((br) => br.bookId === bookId);
    res.json(bookReviews).status(200);
};

export default getBookReviewsByBookId;