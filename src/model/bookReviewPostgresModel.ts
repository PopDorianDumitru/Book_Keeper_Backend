import pool from "../database/postgresDatabase";


interface BookReview{
    ID: string,
    content: string,
    bookId: string,
    rating: number,
    username: string,
    userId: string
}

export const bookReviewList: BookReview[] = [];


export const addBookReview = async (bookReview: BookReview) => {
    const result = await pool.query('INSERT INTO public."bookReviewsTable" ("ID", content, "bookId", rating, username, "userId") VALUES($1, $2, $3, $4, $5, $6)', [bookReview.ID, bookReview.content, bookReview.bookId, bookReview.rating, bookReview.username, bookReview.userId]);
    if(result.rowCount === 0)
        throw new Error("Book review not added");
    // bookReviewList.push(bookReview);
}

export const removeBookReview = async (id: string) => {
    // const index = bookReviewList.findIndex(b => b.ID === id);
    // if (index !== -1) {
    //     bookReviewList.splice(index, 1);
    // }
    // else {
    //     throw new Error("Book review not found");
    // }

    const result = await pool.query('DELETE FROM public."bookReviewsTable" WHERE "ID" = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error("Book review not found");
    }

}

export const getBookReview = async (id: string) => {
    // const bookReview =  bookReviewList.find(b => b.ID === id);
    // if(!bookReview)
    //     throw new Error("Book review not found");
    // return bookReview;

    const bookRow = await pool.query('SELECT * FROM public."bookReviewsTable" WHERE "ID" = $1', [id]);
    if(bookRow.rowCount === 0)
        throw new Error("Book review not found");
    return bookRow.rows[0];

}

export const getBookReviews = async () => {
    return (await pool.query('SELECT * FROM public."bookReviewsTable";')).rows;
}

export const updateBookReviewFields = async(id: string, updatedFields: Partial<BookReview>) => {
    // const index = bookReviewList.findIndex(b => b.ID === id);
    // if (index !== -1) {
    //     let bookReview = {...bookReviewList[index], ...updatedFields};
    //     bookReviewList[index] = bookReview;
    //     return bookReview;
    // }
    // throw new Error("Book review not found");

    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    if(keys.length === 0)
        throw new Error("No fields to update");
    let query = 'UPDATE public."bookReviewsTable" SET ';
    for(let i = 0; i < keys.length; i++){
        query += keys[i] + ' = $' + (i + 1) + ', ';
    }
    query = query.slice(0,-2);
    query += ' WHERE "ID" = $' + (keys.length + 1);
    console.log(query);
    const result = await pool.query(query, [...values, id]);
    if(result.rowCount === 0)
        throw new Error("Book review not found");

}


export const getBookReviewsWithBookId = async (bookId: string) => {
    const result = await pool.query('SELECT * FROM public."bookReviewsTable" WHERE "bookId" = $1', [bookId]);
    return result.rows;
}

export default {addBookReview, removeBookReview, getBookReview, getBookReviews, updateBookReviewFields, getBookReviewsWithBookId}