import { Request, Response } from "express";
import {addBookReview, bookReviewList, getBookReview, getBookReviews, removeBookReview, updateBookReviewFields, getBookReviewsWithBookId} from "../model/bookReviewModel";
import validBookReview from "../validators/bookReviewValidator";
import { getBook } from "../model/bookModel";
import { randomUUID } from "crypto";

export const createNewBookReview = async(req: Request, res: Response) => {
    let bookReview = req.body;

    try{
        bookReview.ID = randomUUID();
        validBookReview(bookReview);
        await getBook(bookReview.bookId)
        await addBookReview(bookReview);
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
        await removeBookReview(id);
        res.status(204).send();
    }
    catch(err: any)
    {
        res.status(404).send(err.message);
    }
}

export const getAllBookReviews = async (req: Request, res: Response) => {
    res.json(await getBookReviews()).status(200);
}

export const getBookReviewById = async(req: Request, res: Response) => {
    const id = req.params.id;
    try{
        if(!id)
            throw new Error("ID is required");
        const bookReview = await getBookReview(id);
        res.json(bookReview).status(200);
    }
    catch(err: any){
        res.status(404).send(err.message);
        return;
    }
}

export const getBookReviewsByBookId = async (req: Request, res: Response) => {
    const bookId = req.params.id;
    const bookReviews = await getBookReviewsWithBookId(bookId);
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
        const bookReview = await getBookReview(id);
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
        await updateBookReviewFields(id, updatedFields);
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