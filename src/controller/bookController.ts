import validBook from "../validators/bookValidator";
import { Request, Response } from "express";
import bookModel from "../model/bookModel";
import { randomUUID } from "crypto";
import OpenAI from "openai";
import jwt from 'jsonwebtoken';
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';

import { addStory, getBookMediumPicture, getBooksByAuthor, getBooksByTitleModel } from "../model/bookPostgresModel";
import { getIdByEmail } from "../model/userPostgresModel";
import axios from "axios";

export const getBooksByTitle = async (req: Request, res: Response) => {
    const title = req.query.title;
    if(!title)
    {
      res.status(400).send("Title is required");
      return;
    }
    res.json(await getBooksByTitleModel(title as string)).status(200);
}


export const getBooksByAuthorController = async (req: Request, res: Response) => {
    const author = req.query.author;
    if(author === undefined)
    {
      res.status(400).send("Author is required");
      return;
    }
    const page = req.query.page;
    if(page === undefined)
      res.json(await getBooksByAuthor(author as string));
    else
      res.json(await getBooksByAuthor(author as string, parseInt(page as string)));
    return;

}

export const getBookPicture = async (req: Request, res: Response) => {
  const id = req.params.id;
  try{
    if(!id)
      throw new Error("ID is required");
    const picture = await getBookMediumPicture(id);
    console.log(picture);
    res.status(200).send(picture);
  }
  catch(err: any){
    res.status(404).send(err.message);
    return;
  }
}

export const getSuggestion = async (req: Request, res: Response) => {
  const text = req.body.text;
  axios.post("https://api.novelai.net/ai/generate-stream", 
    {
      "input": `${text}`,
      "model": "kayra-v1",
      "parameters": {
        "use_string": true,
        "temperature": 0.7,
        "min_length": 50,
        "max_length": 150
      }
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.NOVELAI_API_KEY}`
      }
    }
    
  )
  .then((response) => {
    let data = response.data;
    let lines : string[] = data.split('\n');
    let tokenLines = lines.filter(line => line.startsWith('data:'));
    let tokens = tokenLines.map(line => JSON.parse(line.slice(5)).token);
    let sentence = tokens.join('');
    console.log(sentence)
    res.send(sentence).status(200);
  })
  .catch((error) => {
    console.error(error);
    res.status(500).send("Internal server error");
  })
}

export const createNewStory = async (req: Request, res: Response) => {
  const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null)
    {
        res.status(401).json("Token doesn't exist"); 
        return;
    }

    jwt.verify(token, process.env.SECRET_JWT_KEY!, async (err: any, user: any) => {
        if (err) return res.status(401).json("Token is expired");
        const story = req.body;
        try{
          console.log(user)
          const user_id = await getIdByEmail(user.email);
          story.ID = randomUUID();

          const pdfDoc = await PDFDocument.create();
          pdfDoc.addPage();
          const pdfBytes = await pdfDoc.save();
          console.log(path.join(__dirname, '../../resources/pdf', 'pdfs', story.ID + '.pdf'));
          fs.writeFileSync(path.join(__dirname, '../../resources', 'pdfs', story.ID + '.pdf'), pdfBytes);
          story.pdf_link = story.ID + '.pdf';
          await addStory(story, user_id);
          res.status(201).json(story);          
        }
        catch(err: any){
          res.status(400).json(err.message);
          return;
        }

   
    });

}

export const createNewBook = async (req: Request, res: Response) => {
    console.log("Trying to add book")
    let book = req.body;
    try{
      validBook(book);
      book.ID = randomUUID();
      await bookModel.addBook(book);
      console.log("Book added")
      res.status(201).json(book);
    }
    catch(err: any){
      console.log(err)

      res.status(400).json(err.message);
      return;
    }
}



export const answerBookQuestion = async(req:Request, res:Response) => {
  const message = req.body.message;
  const title = req.body.title;
  const openai = new OpenAI({apiKey: process.env.CHATGPT_API_KEY});
  console.log('The book is ' + title + ". " + message);
  const completion = await openai.chat.completions.create({
    messages: [{role: 'system', content: 'The book is ' + title + ". " + message}],
    model: 'gpt-3.5-turbo-0125'
  });
  res.status(200).send({answer: completion.choices[0].message.content});

}

export const deleteBookById = async(req:Request, res:Response) =>{
    const id = req.params.id;
    try{
      if(!id)
        throw new Error("ID is required");
        await bookModel.removeBook(id);
        res.status(204).send();

    }
    catch(err: any){
      res.status(404).send(err.message);
      return;
    }
}


export const getAllBooks =async (req: Request, res: Response)=>{
    const page = req.query.page;
    if(Object.keys(req.query).length === 0)
      res.json(await bookModel.getBooks()).status(200);
    else
    if(Object.keys(req.query).length === 1 && page)
    {
      
      try{
        const pg = parseInt(page as string);
        res.json(await bookModel.getBooks(pg)).status(200);
      }
      catch(err: any){
        res.status(400).send(err.message);
      }
    }
    else{
      try{
        const {page, ...queryParams} = req.query;
        const pg = parseInt(page as string);
        res.json(await bookModel.getBooksOrdered(queryParams, pg)).status(200);
      }
      catch(err: any){
        res.status(400).send(err.message);
      }
    }
}

export const getBookById = async (req: Request, res: Response) => {
    const id = req.params.id;

    try{
      if(!id)
        throw new Error("ID is required");
      const book = await  bookModel.getBook(id);
      res.json(book).status(200);
    }
    catch(err: any){
      res.status(404).send(err.message);
      return;
    }
    
}

export const updateBook = async (req: Request, res: Response) => {
    const id = req.params.id;
    const updatedFields = req.body;
    try{
      if(!id)
        throw new Error("ID is required");
      if(!updatedFields)
        throw new Error("Updated fields are required");
      const book = await bookModel.getBook(id);
      const newBook = {...book, ...updatedFields};
      console.log(updatedFields);
      validBook(newBook);
      if(book.ID !== newBook.ID)
        throw new Error("Book ID cannot be changed");
      await bookModel.updateBookFields(id, updatedFields);
      res.status(200).json(newBook);

    }
    catch(err: any){
      res.status(404).send(err.message);
      return;
    }
   
}