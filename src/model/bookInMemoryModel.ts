export interface Book{
    ID: string,
    title: string,
    author: string,
    language: string,
    year: number

}

export const bookList: Book[] = [];


export const addBook = async (book: Book) => {
    //bookList.push(book);
    bookList.push(book)
}

export const removeBook = async (id: string) => {
    // const index = bookList.findIndex(b => b.ID === id);
    let index = bookList.findIndex(b => b.ID === id);
    if (index === -1) {
        throw new Error("Book not found");
    }
    bookList.splice(index, 1);

}

export const getBook = async (id: string) => {
    // const book =  bookList.find(b => b.ID === id);
    let index = bookList.findIndex(b => b.ID === id);
    if(index === -1)
        throw new Error("Book not found");
    return bookList[index];
    
}

export const getBooks = async () => {
    return bookList;
}

export const getBooksOrdered = async (parameters: any) => {
    return bookList;
}
export const updateBookFields = async (id: string, updatedFields: Partial<Book>) => {

    const index = bookList.findIndex(b => b.ID === id);
    if (index !== -1) {
        let book = {...bookList[index], ...updatedFields};
        bookList[index] = book;
        return book;
    }
    throw new Error("Book not found");

   
}


export default {addBook, removeBook, getBook, getBooks, updateBookFields, getBooksOrdered}