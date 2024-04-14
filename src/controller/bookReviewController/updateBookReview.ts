import { Request, Response } from "express";
import bookReviewList from "../../model/bookReviewModel";
import validBookReview from "../../validators/bookReviewValidator";

const updateBookReview = (req: Request, res: Response) => {
    const id = req.params.id;
    const bookReviewIndex = bookReviewList.findIndex(b => b.ID === id);
    if (bookReviewIndex === -1) {
      res.status(404).send("Book review not found");
      return;
    }
    const updatedBookReviewFields = req.body;
    try{
        let bookReview = {...bookReviewList[bookReviewIndex], ...updatedBookReviewFields};
        validBookReview(bookReview);
        if(bookReview.userId !== bookReviewList[bookReviewIndex].userId)
            throw new Error("User ID cannot be changed");
        if(bookReview.bookId !== bookReviewList[bookReviewIndex].bookId)
            throw new Error("Book ID cannot be changed");
        if(bookReview.ID !== bookReviewList[bookReviewIndex].ID)
            throw new Error("Book review ID cannot be changed");
        if(bookReview.username !== bookReviewList[bookReviewIndex].username)
            throw new Error("Username cannot be changed");
        bookReviewList[bookReviewIndex] = bookReview;
        res.status(200).send(bookReview);
    }
    catch(err: any){
        res.status(400).send(err.message);
        return;
    }
}

export default updateBookReview;