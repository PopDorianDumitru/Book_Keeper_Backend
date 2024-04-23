const { default: axios } = require("axios");
const { randomUUID } = require("crypto");
const { Pool } = require('pg')
require('dotenv').config();

const pool = new Pool({
    user: process.env.POSTGRES_USERNAME?.toString(),
    host: process.env.POSTGRES_HOST?.toString(),
    database: process.env.POSTGRES_DATABASE?.toString(),
    password: process.env.POSTGRES_PASSWORD?.toString(),
    port: parseInt(process.env.POSTGRES_PORT),
    max: 20,
    idleTimeoutMillis: 30000,
});



const generateReviews = (nr, id) => {
    const reviews = [];
    for (let i = 0; i < nr; i++) {
        reviews.push({
            ID: randomUUID(),
            content: "Good book",
            bookId: id,
            rating: Math.floor(Math.random() * 5) + 1,
            username: "randomUser2",
            userId: "NoIdNeeded"
        })
    }
    return reviews
}

const fake = async (index) => {
    const books = (await axios.get("http://localhost:8080/books")).data;
    let baseQuery = 'INSERT INTO public."bookReviewsTable" ("ID", content, "bookId", rating, username, "userId") VALUES '
    for (let j = index; j < index + 10000; j++) {
        let id = books[j].ID
        for (let i = 0; i < 20; i++) {
            const reviews = generateReviews(50, id);
            let base = "";
            for (let q = 0; q < reviews.length; q++) {
                base = base + "( '" + reviews[q].ID + "', '" + reviews[q].content + "', '" + reviews[q].bookId + "', " + reviews[q].rating + ", '" + reviews[q].username + "', '" + reviews[q].userId + "' )"
                if (q != reviews.length - 1)
                    base = base + ","
            }
            const completeQuery = baseQuery + base;
            await pool.query(completeQuery)
        }
    }
}
fake(0)
fake(10000)
fake(20000)
fake(30000)
fake(40000)
fake(50000)
fake(60000)
fake(70000)
fake(80000)
fake(90000)

