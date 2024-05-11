import pool from '../database/postgresDatabase'

export interface RefreshToken {
    token: string,
    email: string,
    username: string,
}

const addRefreshToken = async (token:string, email:string, username:string) => {
    const query = `
      INSERT INTO public.refresh_tokens (token, email, username)
      VALUES ($1, $2, $3);
    `;
  
    await pool.query(query, [token, email, username]);
  };
  
  const removeRefreshToken = async (email:string) => {
    const query = `
      DELETE FROM public.refresh_tokens
      WHERE email = $1;
    `;
  
    await pool.query(query, [email]);
  };

  const getRefreshToken = async (email:string) => {
    const query = `
      SELECT * FROM public.refresh_tokens
      WHERE email = $1;
    `;
  
    const result = await pool.query(query, [email]);
    if(result.rows.length == 0)
        throw Error("No tokens for that email")
    return result.rows[0];
  };

export default {removeRefreshToken, addRefreshToken, getRefreshToken}