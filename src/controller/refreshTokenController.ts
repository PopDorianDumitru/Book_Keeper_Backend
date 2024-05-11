import { Request, Response } from 'express';
import refreshTokenModel from '../model/refreshTokenPostgresModel';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
export const AddRefreshToken = async (token: string, email: string, username: string) => {
  
  if (!token || !email || !username) {
    throw Error("Invalid arguments");
  }

  let hashedToken = await bcrypt.hash(token, 10);
  try{
      await refreshTokenModel.addRefreshToken(hashedToken, email, username);
  }
  catch(err: any){
    throw new Error("Error adding refresh token");
  }
};

export const RemoveRefreshToken = async (email: string) => {
  try{
      await refreshTokenModel.removeRefreshToken(email);
  }  
  catch(err: any)
  {
    throw new Error("Error removing refresh token");
  }
};

export const getHashedRefreshToken = async (email: string) => {
  let refreshToken = "";
  try{
    refreshToken = await refreshTokenModel.getRefreshToken(email);
    return refreshToken;
  }
  catch(err: any)
  {
    throw Error("Refresh token not found");
  }
};

export default {AddRefreshToken, RemoveRefreshToken, getHashedRefreshToken}