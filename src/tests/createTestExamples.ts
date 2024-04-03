import bookList from "../model/bookModel";

const createBook = (ID: string, title: string, author: string, year: number, language: string) => {
    return {
        ID,
        title,
        author,
        year,
        language
    }
}

const createTestExamples = () => {
    bookList.push(createBook("1", "The Great Gatsby", "F. Scott Fitzgerald", 1925, "English"));
    bookList.push(createBook("2", "War and Peace", "Leo Tolstoy", 1869, "Russian"));
    bookList.push(createBook("3", "Pride and Prejudice", "Jane Austen", 1813, "English"));
}
export default createTestExamples