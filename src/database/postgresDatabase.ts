import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();
const pool = new Pool({
    user: process.env.POSTGRES_USERNAME?.toString(),
    host: process.env.POSTGRES_HOST?.toString(),
    database: process.env.POSTGRES_DATABASE?.toString(),
    password:  process.env.POSTGRES_PASSWORD?.toString(),
    port: parseInt(process.env.POSTGRES_PORT as string),
    max: 20,
    idleTimeoutMillis: 30000,
});



export default pool;