

interface BookReview{
    ID: string,
    content: string,
    bookId: string,
    rating: number,
    username: string,
    userId: string
}

export const getBookRatingCount = async (bookId: string) => {
    return bookReviewList.filter(b => b.bookId === bookId).length;
}

export const getBookRatingSum = async (bookId: string) => {
    return bookReviewList.filter(b => b.bookId === bookId).reduce((acc, b) => acc + b.rating, 0);
}

export const bookReviewList: BookReview[] = [];


export const addBookReview = async (bookReview: BookReview) => {
    bookReviewList.push(bookReview);
}

export const removeBookReview = async (id: string) => {
    const index = bookReviewList.findIndex(b => b.ID === id);
    if (index !== -1) {
        bookReviewList.splice(index, 1);
    }
    else {
        throw new Error("Book review not found");
    }

    // const result = await pool.query('DELETE FROM public."bookReviewsTable" WHERE "ID" = $1', [id]);
    // if (result.rowCount === 0) {
    //     throw new Error("Book review not found");
    // }

}

export const getBookReview = async (id: string) => {
    const bookReview =  bookReviewList.find(b => b.ID === id);
    if(!bookReview)
        throw new Error("Book review not found");
    return bookReview;

    // const bookRow = await pool.query('SELECT * FROM public."bookReviewsTable" WHERE "ID" = $1', [id]);
    // if(bookRow.rowCount === 0)
    //     throw new Error("Book review not found");
    // return bookRow.rows[0];

}

export const getBookReviews = async () => {
    return bookReviewList;
}

export const updateBookReviewFields = async(id: string, updatedFields: Partial<BookReview>) => {
    const index = bookReviewList.findIndex(b => b.ID === id);
    if (index !== -1) {
        let bookReview = {...bookReviewList[index], ...updatedFields};
        bookReviewList[index] = bookReview;
        return bookReview;
    }
    throw new Error("Book review not found");

    

}


export const getBookReviewsWithBookId = async (bookId: string) => {
    const bookReviews = bookReviewList.filter(b => b.bookId === bookId);
    return bookReviews;
}

export default {addBookReview, removeBookReview, getBookReview, getBookReviews, getBookRatingCount, getBookRatingSum, updateBookReviewFields, getBookReviewsWithBookId}