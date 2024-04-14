import { Request, Response } from "express";
import bookReviewList from "../../model/bookReviewModel";
import validBookReview from "../../validators/bookReviewValidator";
import bookList from "../../model/bookModel";
import { randomUUID } from "crypto";
const createNewBookReview = (req: Request, res: Response) => {
    let bookReview = req.body;

    try{
        bookReview.ID = randomUUID();
        validBookReview(bookReview);
        if(bookList.findIndex(b => b.ID === bookReview.bookId) === -1)
            throw new Error("Book not found");
        bookReviewList.push(bookReview);
        res.status(201).send(bookReview);
    }
    catch(err: any){
        res.status(400).send(err.message);
        return;
    }

};

export default createNewBookReview;