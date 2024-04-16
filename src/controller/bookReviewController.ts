import { Request, Response } from "express";
import {addBookReview, bookReviewList, getBookReview, getBookReviews, removeBookReview, updateBookReviewFields} from "../model/bookReviewModel";
import validBookReview from "../validators/bookReviewValidator";
import { getBook } from "../model/bookModel";
import { randomUUID } from "crypto";

export const createNewBookReview = (req: Request, res: Response) => {
    let bookReview = req.body;

    try{
        bookReview.ID = randomUUID();
        validBookReview(bookReview);
        getBook(bookReview.bookId)
        addBookReview(bookReview);
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
    try{
        if(!id)
            throw new Error("ID is required");
        removeBookReview(id);
        res.status(204).send();
    }
    catch(err: any)
    {
        res.status(404).send(err.message);
    }
}

export const getAllBookReviews =  (req: Request, res: Response) => {
    res.json(getBookReviews()).status(200);
}

export const getBookReviewById = (req: Request, res: Response) => {
    const id = req.params.id;
    try{
        if(!id)
            throw new Error("ID is required");
        const bookReview = getBookReview(id);
        res.json(bookReview).status(200);
    }
    catch(err: any){
        res.status(404).send(err.message);
        return;
    }
}

export const getBookReviewsByBookId = async (req: Request, res: Response) => {
    const bookId = req.params.id;
    const bookReviews = bookReviewList.filter((br) => br.bookId === bookId);
    res.json(bookReviews).status(200);
};

export const updateBookReview = (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedFields = req.body;
    try{
        if(!id)
            throw new Error("ID is required");
        if(!updatedFields)
            throw new Error("Updated fields are required");
        const bookReview = getBookReview(id);
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
        updateBookReviewFields(id, updatedFields);
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