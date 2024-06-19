import multer, {diskStorage} from 'multer';
import {Request, Response} from 'express';
import { updateBookPDF, getBookPDF } from '../model/bookPostgresModel';
import fs from 'fs';

import path from 'path';

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './resources/pdfs')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname)
    }
})


const upload = multer({storage: storage})

export const uploadPDF = (req: Request, res: Response) => {
    if(req.file)
    {
        updateBookPDF(req.query.id as string, req.file.originalname);
        res.status(200).send("File uploaded successfully")
    }
    else
    {
        res.status(400).send("File not uploaded")
    }
    
}

export const getPDF = async (req: Request, res: Response) => {
    const id = req.params.id;
    if(id)
    {
        try{
            
            const pdf_title = await getBookPDF(id as string);
            if(pdf_title === "" || pdf_title === null)
            {
                res.status(404).send("Book not found");
                return;
            }
            const pdfPath = path.join(__dirname, `../../resources/pdfs/${pdf_title}`);
            fs.access(pdfPath,fs.constants.F_OK, (err) => {
                if(err)
                {
                    res.status(404).send("Book PDF not found");
                    return;     
                }
                res.download(pdfPath);
            })
        }
        catch(err: any){
            res.status(404).send(err.message);
            return;
        }
        

        
    }
    else
    {
        res.status(400).send("ID is required")
    }
}

export default upload;