import userModel from '../model/userPostgresModel';
import { Request, Response } from "express";
import { randomUUID } from "crypto";
import validUser from '../validators/userValidator';
import bcrypt from 'bcrypt';
import jwt, { JwtPayload, TokenExpiredError } from 'jsonwebtoken'
import refreshTokenController from './refreshTokenController';
import refreshTokenPostgresModel from '../model/refreshTokenPostgresModel';
import verificationPostgresModel from '../model/userCodesPostgresModel'
import nodemailer from 'nodemailer';
import userCodesPostgresModel from '../model/userCodesPostgresModel';
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userModel.getAllUsers();
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json(err.message);
  }
};

export const authenticateUser = async(req: Request, res: Response) => {
  const defaultReturnObject = {authenticated: false, user: null};
  try{
    const token = String(req?.headers?.authorization?.replace('Bearer ', ''));
    if(!token){
      res.status(401).json(defaultReturnObject);
      return;
    }
    const user:any = jwt.verify(token, process.env.SECRET_JWT_KEY!);
    res.status(200).json({authenticated: true, user: {email: user.email, username: user.username}});
  } catch (err: any){
    res.status(401).json(defaultReturnObject);
  }
}

export const getAccessToken = async (req: Request, res: Response) =>{
  try{
    const refreshToken = req.cookies['refreshToken'];
    if(!refreshToken)
    {
      res.status(400).json("Bad token request. Missing refresh token");
      return;
    }
    let payload : string | object="";
    try{
      payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!);
    }
    catch(err : any){
      if(err instanceof TokenExpiredError)
        {
          const decodedToken: any = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!, {ignoreExpiration: true});
          if(decodedToken && decodedToken.email){
            await refreshTokenController.RemoveRefreshToken(decodedToken.email);
          }
          res.status(401).json("Token expired");
          return;
        }
      else{
        throw err;
      }
    }
    if(typeof payload !== 'object')
      {
        res.status(400).json("Bad token");
        return;
      }
    const user = payload as JwtPayload;
    const hashedToken:any = await refreshTokenController.getHashedRefreshToken(user.email);
    if(!hashedToken)
    {
      res.status(400).json("Invalid token");
      return;
    }
    const match = await bcrypt.compare(refreshToken, hashedToken.token);
    if(!match)
    {
      res.status(400).json("Invalid token");
      return;
    }
    const accessToken = jwt.sign({email: user.email, username: user.username}, process.env.SECRET_JWT_KEY!, {expiresIn: process.env.ACCESS_TOKEN_VALIDITY + "s"});
    res.status(200).json({accessToken});
  }
  catch(err:any)
  {
    res.status(400).json(err.message);
  }
}

export const getUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json("ID is required");
    return;
  }
  try {
    const user = await userModel.getUserById(id);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(404).json(err.message);
  }
}

export const addUser = async (req: Request, res: Response) => {
  let user = req.body;

  try {
    user.id = randomUUID();
    validUser(user);
    
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(user.password, saltRounds);
    user.password = hashedPassword

    await userModel.addUser(user);
    const email = user.email;
    const domain = email.split('@')[1];
    let transporter = nodemailer.createTransport({
      host: `smtp.gmail.com`,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    const verify_code = jwt.sign({email: email}, process.env.SECRET_JWT_KEY!);
    const verificationLink = `${process.env.CLIENT_URL}/verify?token=${verify_code}`

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Account verification Book Keeper",
      text: `Please click the following link to verify your account: ${verificationLink}`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    const minutes = Number(process.env.EMAIL_VERIFICATION_VALID_MINUTES) * 60 * 1000;
    await verificationPostgresModel.addVerification({email: user.email, verify_code: await bcrypt.hash(verify_code, 10), expiration_date: new Date(Date.now() + minutes)});
    res.status(201).end();
  } catch (err: any) {
    res.status(400).json(err.message);
  }
}

export const sendVerificationEmail = async (req: Request, res: Response) => {
  const email = req.body.email;
  if(!email){
    res.status(400).json("Email is required");
    return;
  }
  try{
    const user = await userModel.getUserByEmail(email);
    if(!user)
    {
      res.status(404).json("User not found");
      return;
    }
    await verificationPostgresModel.removeVerificationByEmail(email);

    const domain = email.split('@')[1];
    let transporter = nodemailer.createTransport({
      host: `smtp.gmail.com`,
      auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
      }
    });
    const verify_code = jwt.sign({email: email}, process.env.SECRET_JWT_KEY!);
    const verificationLink = `${process.env.CLIENT_URL}/verify?token=${verify_code}`

    let mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Account verification Book Keeper",
      text: `Please click the following link to verify your account: ${verificationLink}`
    }

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return;
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    const minutes = Number(process.env.EMAIL_VERIFICATION_VALID_MINUTES) * 60 * 1000;
    await verificationPostgresModel.addVerification({email: user.email, verify_code: await bcrypt.hash(verify_code, 10), expiration_date: new Date(Date.now() + minutes)});
    res.status(200).end();
  }
  catch(err: any){
    res.status(404).json(err.message);
  }
}

export const getUsersByUsername = async (req: Request, res: Response) => {
  const username = req.params.username;
  if (!username) {
    res.status(400).json("Username is required");
    return;
  }
  try {
    const user = await userModel.getUsersByUsername(username);
    res.status(200).json(user);
  } catch (err: any) {
    res.status(404).json(err.message);
  }
}

const isSixDigitCode = (code: string): boolean => {
  return /^\d{6}$/.test(code);
};


export const removeUserById = async (req: Request, res: Response) => {
  const id = req.params.id;
  if (!id) {
    res.status(400).json("ID is required");
    return;
  }
  try {
    await userModel.removeUserById(id);
    res.status(204).send();
  } catch (err: any) {
    res.status(404).json(err.message);
  }
}

export const logInUsingEmailAndPassword = async (req: Request, res: Response) => {
  const { email, password, code } = req.body;
  if (!email || !password) {
    res.status(400).json("Email and password are required");
    return;
  }
  try {
    const user = await userModel.getUserByEmail(email);
    if(!user){
      res.status(404).json("User not found");
      return;
    }

    const match = await bcrypt.compare(password, user.password);
    if(!match)
    {
      res.status(400).json("Invalid password");
      return;
    }
    delete user.password;

    if(!user.verified)
    {
      res.status(403).json({message: "That email has not been verified!"});
      return;
    }

    if(!code)
    {
      const domain = email.split('@')[1];
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      let transporter = nodemailer.createTransport({
        host: `smtp.gmail.com`,
        auth: {
          user: process.env.EMAIL,
          pass: process.env.EMAIL_PASSWORD
        }
      });
      let mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: "Book Keeper Log In Code",
        text: `Your code to log in is: ${verificationCode}`
      }
  
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          return;
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
      await userCodesPostgresModel.removeVerificationByEmail(email);
      await userCodesPostgresModel.addVerification({verify_code: verificationCode, expiration_date: new Date(Date.now() + Number(process.env.EMAIL_VERIFICATION_VALID_MINUTES) * 60 * 1000), email: email});
      res.status(200).json({message: "Verification code sent", secondFactorAuthenticationRequired: true});
    }
    else
    {
      if(!isSixDigitCode(code))
      {
        res.status(400).json({message: "Invalid code"});
        return;
      }
      const verification = await userCodesPostgresModel.getVerificationByEmail(email);
      if(verification.verify_code != code)
      {
        res.status(400).json({message: "Code is not correct"});
        return;
      }
      if(verification.expiration_date < Date.now())
      {
        res.status(400).json({message: "Code is expired"});
        return;
      }
      const token = jwt.sign(user, process.env.SECRET_JWT_KEY!, {expiresIn: process.env.ACCESS_TOKEN_VALIDITY + "s"});
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET!, {expiresIn: process.env.REFRESH_TOKEN_VALIDITY + "s"})
      await userCodesPostgresModel.removeVerificationByEmail(email);
      refreshTokenController.AddRefreshToken(refreshToken, user.email, user.username)
      res.cookie('refreshToken', refreshToken, {httpOnly: true, maxAge: parseInt(process.env.REFRESH_TOKEN_VALIDITY!) * 1000});  
      res.status(200).json({user, token});
  
    }
  } catch (err: any) {
    res.status(404).json(err.message);
  }
}

export const logOutUser = async (req: Request, res: Response) => {
  const token = String(req?.headers?.authorization?.replace('Bearer ', ''));
  if(!token){
    res.status(401).json("No token provided");
    return;
  }
  try{
    const user:any = jwt.verify(token, process.env.SECRET_JWT_KEY!);
    console.log("Got here")
    await refreshTokenController.RemoveRefreshToken(user.email);
    res.clearCookie('refreshToken');
    res.status(200).json("Logged out");
  }
  catch(err: any){
    res.status(401).json("Invalid token");
  }

}

export const getUserByEmail = async(req:Request, res: Response) => {
  const email = req.body.email;
  if(!email){
    res.status(400).json("Email is required");
    return;
  }
  try{
    const user = await userModel.getUserByEmailNoPassword(email);
    if(!user)
      res.status(404).json("User not found");
    else
      res.status(200).json(user);
  }
  catch(err: any){
    res.status(404).json(err.message);
  }
}

export const verifyUser = async(req: Request, res: Response) => {
  const token = req.query.token;

  let decodedToken: string | Object = "";
  try{
    decodedToken = jwt.verify(token as string, process.env.SECRET_JWT_KEY!);
  }
  catch(err: any){
    res.status(400).json("Invalid token");
    return;
  }
  if(typeof decodedToken !== 'object')
  {
    res.status(400).json("Invalid token");
    return;
  }
  const email = (decodedToken as JwtPayload).email;
  if(!token){
    res.status(400).json("Token is required");
    return;
  }
  if(!email){
    res.status(400).json("Email is required");
    return;
  }
  try{
    try{
      const user = await userModel.getUserByEmailNoPassword(email as string);
    }
    catch(err:any){
      res.status(404).json({message: "Could not find any account linked to this email… Maybe sign up first?"});
      return;
    }
    const verification = await verificationPostgresModel.getVerificationByEmail(email as string);
    if(!verification)
    {
      res.status(404).json("Verification not found");
      return;
    }
    // if(verification.expiration_date < Date.now())
    // {
    //   res.status(400).json("Verification token expired");
    //   return;
    // }
    const match = await bcrypt.compare(token as string, verification.verify_code);
    if(!match)
    {
      res.status(400).json("Invalid verification token");
      return;
    }
    await userModel.verifyUser(verification.email);
    await verificationPostgresModel.removeVerificationByEmail(verification.email);
    res.status(201).end();
  }
  catch(err: any){
    res.status(404).json(err.message);
  }
}

export default { getAllUsers, getUserById, addUser, getUsersByUsername, removeUserById, logInUsingEmailAndPassword, authenticateUser, getAccessToken, logOutUser, getUserByEmail, sendVerificationEmail, verifyUser}