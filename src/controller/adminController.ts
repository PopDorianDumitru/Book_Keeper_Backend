import { Request, Response } from "express";
import { registerModerator as registerModeratorDatabase }  from "../model/userPostgresModel";
export const registerModerator = async (req: Request, res: Response) => {
    const { email } = req.body;
    try {
        await registerModeratorDatabase(email);
        res.status(200).json("Moderator registered successfully");
    } catch (error) {
        res.status(500).json("An account with that email doesn't exist");
    }
}

export const confirmAdmin = async (req: Request, res: Response) => {
    res.status(200).json("Admin confirmed");
}
export default { registerModerator, confirmAdmin } 