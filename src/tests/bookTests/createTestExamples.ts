import bookModel from "../../model/bookModel";
import bookReviewModel from "../../model/bookReviewModel";

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
    bookModel.addBook(createBook("123456789", "The Great Gatsby", "F. Scott Fitzgerald", 1925, "English"));
    bookModel.addBook(createBook("234567890", "War and Peace", "Leo Tolstoy", 1869, "Russian"));
    bookModel.addBook(createBook("345678901", "Pride and Prejudice", "Jane Austen", 1813, "English"));
}
export default createTestExamples