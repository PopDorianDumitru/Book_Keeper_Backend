import pool from "../database/postgresDatabase";

interface Book{
    ID: string,
    title: string,
    author: string,
    language: string,
    year: number

}

export const bookList: Book[] = [];


export const addBook = async (book: Book) => {
    //bookList.push(book);
    const result = await pool.query('INSERT INTO public."booksTable" ("ID", title, author, language, year) VALUES ($1, $2, $3, $4, $5)', [book.ID, book.title, book.author, book.language, book.year]);
    if(result.rowCount === 0)
        throw new Error("Book not added");
}

export const removeBook = async (id: string) => {
    // const index = bookList.findIndex(b => b.ID === id);

    const result = await pool.query('DELETE FROM public."booksTable" WHERE "ID" = $1', [id]);
    if (result.rowCount === 0) {
        throw new Error("Book not found");
    }
}

export const getBook = async (id: string) => {
    // const book =  bookList.find(b => b.ID === id);
    const bookRow = await pool.query('SELECT * FROM public."booksTable" WHERE "ID" = $1', [id]);
    if(bookRow.rowCount === 0)
        throw new Error("Book not found");
    return bookRow.rows[0];
    
}

export const getBooks = async () => {
    return (await pool.query('SELECT "ID", title, author, language, year FROM public."booksTable";')).rows;
}

export const updateBookFields = async (id: string, updatedFields: Partial<Book>) => {

    // const index = bookList.findIndex(b => b.ID === id);
    // if (index !== -1) {
    //     let book = {...bookList[index], ...updatedFields};
    //     bookList[index] = book;
    //     return book;
    // }
    // throw new Error("Book not found");

    const keys = Object.keys(updatedFields);
    const values = Object.values(updatedFields);
    if(keys.length === 0)
        throw new Error("No fields to update");
    let query = 'UPDATE public."booksTable" SET ';
    for(let i = 0; i < keys.length; i++){
        query += keys[i] + ' = $' + (i + 1) + ', ';
    }
    query = query.slice(0, -2);
    query += ' WHERE "ID" = $'+ (keys.length + 1);
    console.log(query);

    const result = await pool.query(query, [...values, id]);
    if(result.rowCount === 0)
    {
        throw new Error("Book not found");
    }
}