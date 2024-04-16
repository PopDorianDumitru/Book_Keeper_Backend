import {bookList} from "../../model/bookModel";
import {bookReviewList} from "../../model/bookReviewModel";
const createBook = (ID: string, title: string, author: string, year: number, language: string) => {
    return {
        ID,
        title,
        author,
        year,
        language
    }
}

const createBookReview = (ID: string, content: string, bookId: string, rating: number, username: string, userId: string) => {
    return {
        ID,
        content,
        bookId,
        rating,
        username,
        userId
    }
}

const createTestExamples = () => {
    bookList.push(createBook("123456789", "The Great Gatsby", "F. Scott Fitzgerald", 1925, "English"));
    bookList.push(createBook("234567890", "War and Peace", "Leo Tolstoy", 1869, "Russian"));
    bookList.push(createBook("345678901", "Pride and Prejudice", "Jane Austen", 1813, "English"));


    bookReviewList.push(createBookReview("123456789", "Great book", bookList[0].ID, 5, "John", "123456789"));
    bookReviewList.push(createBookReview("234567890", "Not a great book", bookList[0].ID, 2, "Jane", "234567890"));
    bookReviewList.push(createBookReview("345678901", "I loved it", bookList[1].ID, 4, "Alice", "345678901"));
}

export default createTestExamples;