

interface BookReview{
    ID: string,
    content: string,
    bookId: string,
    rating: number,
    username: string,
    userId: string
}

export const bookReviewList: BookReview[] = [];


export const addBookReview = (bookReview: BookReview) => {
    bookReviewList.push(bookReview);
}

export const removeBookReview = (id: string) => {
    const index = bookReviewList.findIndex(b => b.ID === id);
    if (index !== -1) {
        bookReviewList.splice(index, 1);
    }
    else {
        throw new Error("Book review not found");
    }
}

export const getBookReview = (id: string) => {
    const bookReview =  bookReviewList.find(b => b.ID === id);
    if(!bookReview)
        throw new Error("Book review not found");
    return bookReview;
}

export const getBookReviews = () => {
    return bookReviewList;
}

export const updateBookReviewFields = (id: string, updatedFields: Partial<BookReview>) => {
    const index = bookReviewList.findIndex(b => b.ID === id);
    if (index !== -1) {
        let bookReview = {...bookReviewList[index], ...updatedFields};
        bookReviewList[index] = bookReview;
        return bookReview;
    }
    throw new Error("Book review not found");
}