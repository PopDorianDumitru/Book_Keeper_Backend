import { Request, Response } from "express";
import bookReviewList from "../model/bookReviewModel";
import validBookReview from "../validators/bookReviewValidator";
import bookList from "../model/bookModel";
import { randomUUID } from "crypto";

export const createNewBookReview = (req: Request, res: Response) => {
    let bookReview = req.body;

    try{
        bookReview.ID = randomUUID();
        validBookReview(bookReview);
        if(bookList.findIndex(b => b.ID === bookReview.bookId) === -1)
            throw new Error("Book not found");
        bookReviewList.push(bookReview);
        console.log(bookReview);
        res.status(201).send(bookReview);
    }
    catch(err: any){
        res.status(400).send(err.message);
        return;
    }

};

export const deleteBookReviewById =  (req: Request, res: Response) => {
    const id = req.params.id;
    const index = bookReviewList.findIndex(b => b.ID === id);
    if (index === -1) {
      res.status(404).send("Book review not found");
      return;
    }
    bookReviewList.splice(index, 1);
    res.status(204).send();
}

export const getAllBookReviews =  (req: Request, res: Response) => {
    res.json(bookReviewList).status(200);
}

export const getBookReviewById = (req: Request, res: Response) => {
    const id = req.params.id;
    let bookReview = bookReviewList.find(b => b.ID === id);
    if(!bookReview){
        res.status(404).send("Book Review not found");
        return;
    }
    res.json(bookReview).status(200);

}

export const getBookReviewsByBookId = async (req: Request, res: Response) => {
    const bookId = req.params.id;
    const bookReviews = bookReviewList.filter((br) => br.bookId === bookId);
    res.json(bookReviews).status(200);
};

export const updateBookReview = (req: Request, res: Response) => {
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