import { Request, Response } from "express"
import pool from '../database/postgresDatabase'
export interface Verification{
    email: string,
    verify_code: string,
    expiration_date: Date
}

export const addVerification = async (verification : Verification) =>{
    const query = `
        INSERT INTO public.verify_user_codes (email, verify_code, expiration_date)
        VALUES ($1, $2, $3);
    `;
    await pool.query(query, [verification.email, verification.verify_code, verification.expiration_date]);
}

export const removeVerificationByEmail = async (email: string) =>{
    const query = `
        DELETE FROM public.verify_user_codes
        WHERE email = $1;
    `;
    await pool.query(query, [email]);
}

export const getVerificationByEmail = async (email: string) => {
    const query = `SELECT * FROM public.verify_user_codes WHERE email = $1;`
    const result = await pool.query(query, [email]);
    if(result.rows.length == 0)
        throw Error("No verification code for that email")
    return result.rows[0];
}

export default {addVerification, removeVerificationByEmail, getVerificationByEmail}