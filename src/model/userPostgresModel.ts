import pool from "../database/postgresDatabase";

export interface User{
    id: string,
    username: string,
    password: string,
    email: string,
    session_id: string,
    session_expiration_date: Date,
    verified: boolean,
    role: string
}


export const getUserById = async (id: string) => {
    const userRow = await pool.query('SELECT username, email, verified FROM public.users WHERE id = $1', [id]);
    if(userRow.rowCount === 0)
        throw new Error("User not found");
    return userRow.rows[0];
}

export const getUserByEmail = async (email: string) => {
    const userRow = await pool.query('SELECT username, email, password, verified, role FROM public.users WHERE email = $1', [email]);
    if(userRow.rowCount === 0)
        throw new Error("User not found");
    return userRow.rows[0];
}

export const verifyUser = async(email:string) =>{
    const result = await pool.query('UPDATE public.users SET verified = true WHERE email = $1', [email]);
    if(result.rowCount === 0)
        throw new Error("User not found");

}

export const getUserByEmailNoPassword = async (email: string) => {
    const userRow = await pool.query('SELECT username, email, role, verified FROM public.users WHERE email = $1', [email]);
    if(userRow.rowCount === 0)
        throw new Error("User not found");
    return userRow.rows[0];
}

export const getIdByEmail = async (email: string) => {
    const userRow = await pool.query('SELECT id FROM public.users WHERE email = $1', [email]);
    if(userRow.rowCount === 0)
        throw new Error("User not found");
    return userRow.rows[0].id;
}

export const getAllUsers = async () => {
    return (await pool.query('SELECT username, email, verified FROM public.users')).rows;
}

export const addUser = async (user: User) => {

    try{
        const result = await pool.query('INSERT INTO public.users (id, username, password, email, session_id, session_expiration_date, verified) VALUES ($1, $2, $3, $4, $5, $6, false)', [user.id, user.username, user.password, user.email, user.session_id, user.session_expiration_date]);
        if(result.rowCount === 0)
            throw new Error("User not added");
    }
    catch(err){
        throw new Error("Email already in use");
    }
    
}

export const getUsersByUsername = async (username: string) => {
    const userRow = await pool.query('SELECT username, email, verified FROM public.users WHERE username = $1', [username]);
    if(userRow.rowCount === 0)
        throw new Error("User not found");
    return userRow.rows[0];
}

export const removeUserById = async (id: string) => {
    const result = await pool.query('DELETE FROM public.users WHERE id = $1', [id]);
    if(result.rowCount === 0)
        throw new Error("User not found");
}


export const isAdmin = async (email: string) => {
    const userRow = await pool.query('SELECT role FROM public.users WHERE email = $1', [email]);
    if(userRow.rowCount === 0)
        throw new Error("User not found");
    return userRow.rows[0].role === 'admin';
}

export const isModerator = async (email: string) => {
    const userRow = await pool.query('SELECT role FROM public.users WHERE email = $1', [email]);
    if(userRow.rowCount === 0)
        throw new Error("User not found");
    return userRow.rows[0].role === 'moderator' || userRow.rows[0].role === 'admin';
}

export const registerModerator = async (email: string) => {
    const result = await pool.query('UPDATE public.users SET role = $1 WHERE email = $2', ['moderator', email]);
    if(result.rowCount === 0)
        throw new Error("User not found");
}


export default {getUserById, getAllUsers, addUser, getUsersByUsername, removeUserById, getUserByEmail, getUserByEmailNoPassword, verifyUser, isAdmin, isModerator}
