import { Request, Response } from "express";
import bookReviewModel from "../model/bookReviewModel";
import validBookReview from "../validators/bookReviewValidator";
import bookModel from "../model/bookModel";
import { randomUUID } from "crypto";

export const createNewBookReview = async(req: Request, res: Response) => {
    let bookReview = req.body;
    
    try{
        bookReview.ID = randomUUID();
        validBookReview(bookReview);
        await bookModel.getBook(bookReview.bookId)
        await bookReviewModel.addBookReview(bookReview);
        console.log(bookReview);
        res.status(201).send(bookReview);
    }
    catch(err: any){
        res.status(400).send(err.message);
        return;
    }

};

export const deleteBookReviewById = async (req: Request, res: Response) => {
    const id = req.params.id;
    try{
        if(!id)
            throw new Error("ID is required");
        await bookReviewModel.removeBookReview(id);
        res.status(204).send();
    }
    catch(err: any)
    {
        res.status(404).send(err.message);
    }
}

export const getAllBookReviews = async (req: Request, res: Response) => {
    res.json(await bookReviewModel.getBookReviews()).status(200);
}

export const getBookRating = async(req: Request, res: Response) => {
    const bookId = req.params.id;
    try{
        if(!bookId)
            throw new Error("Book ID is required");
        const nrOfReviews = await bookReviewModel.getBookRatingCount(bookId);
        if(nrOfReviews === 0)
            res.status(200).json({rating: "No ratings yet"});
        const ratingSum = await bookReviewModel.getBookRatingSum(bookId);
        const rating = ratingSum / nrOfReviews;
        res.json(rating).status(200);
    }
    catch(err: any){
        res.status(400).send(err.message);
        return;
    }

}

export const getBookReviewById = async(req: Request, res: Response) => {
    const id = req.params.id;
    try{
        if(!id)
            throw new Error("ID is required");
        const bookReview = await bookReviewModel.getBookReview(id);
        res.json(bookReview).status(200);
    }
    catch(err: any){
        res.status(404).send(err.message);
        return;
    }
}

export const getBookReviewsByBookId = async (req: Request, res: Response) => {
    const bookId = req.params.id;
    const page = req.query.page;
    if(Object.keys(req.query).length === 1 && page)
    {
        console.log("Got here", page);
          try{
            const pg = parseInt(page as string);
            res.json(await bookReviewModel.getBookReviewsWithBookId(bookId, pg)).status(200);
          }
          catch(err: any){
            res.status(400).send(err.message);
          }
          return;
    }

    const bookReviews = await bookReviewModel.getBookReviewsWithBookId(bookId);
    res.json(bookReviews).status(200);
};

export const updateBookReview = async(req: Request, res: Response) => {
    const id = req.params.id;
    const updatedFields = req.body;
    try{
        if(!id)
            throw new Error("ID is required");
        if(!updatedFields)
            throw new Error("Updated fields are required");
        const bookReview = await bookReviewModel.getBookReview(id);
        const newBookReview = {...bookReview, ...updatedFields};
        validBookReview(newBookReview);
        if(newBookReview.ID !== bookReview.ID)
            throw new Error("Book review ID cannot be changed");
        if(newBookReview.userId !== bookReview.userId)
            throw new Error("User ID cannot be changed");
        if(newBookReview.bookId !== bookReview.bookId)
            throw new Error("Book ID cannot be changed");
        if(newBookReview.username !== bookReview.username)
            throw new Error("Username cannot be changed");
        await bookReviewModel.updateBookReviewFields(id, updatedFields);
        res.status(200).json(newBookReview);
    }
    catch(err: any){
        if(err.message.includes("not found"))
            res.status(404).send(err.message);
        else
            res.status(400).send(err.message);
        return;
    }
}