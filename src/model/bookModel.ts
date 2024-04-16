interface Book{
    ID: string,
    title: string,
    author: string,
    language: string,
    year: number

}

export const bookList: Book[] = [];


export const addBook = (book: Book) => {
    bookList.push(book);
}

export const removeBook = (id: string) => {
    const index = bookList.findIndex(b => b.ID === id);
    if (index !== -1) {
        bookList.splice(index, 1);
    }
    else {
        throw new Error("Book not found");
    }
}

export const getBook = (id: string) => {
    const book =  bookList.find(b => b.ID === id);
    if(!book)
        throw new Error("Book not found");
    return book;
}

export const getBooks = () => {
    return bookList;
}

export const updateBookFields = (id: string, updatedFields: Partial<Book>) => {
    const index = bookList.findIndex(b => b.ID === id);
    if (index !== -1) {
        let book = {...bookList[index], ...updatedFields};
        bookList[index] = book;
        return book;
    }
    throw new Error("Book not found");
}