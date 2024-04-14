

interface BookReview{
    ID: string,
    content: string,
    bookId: string,
    rating: number,
    username: string,
    userId: string
}

let bookReviewList: BookReview[] = [];
export default bookReviewList;