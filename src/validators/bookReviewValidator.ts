
const validBookReview = (review: {ID: string, content: string, bookId: string, rating: number, username: string}): boolean => {
    if(review.ID === undefined)
    throw new Error("Invalid book review object, missing ID");

    if(review.content === undefined)
    throw new Error("Invalid book review object, missing content");

    if(review.bookId === undefined)
    throw new Error("Invalid book review object, missing bookId");

    if(review.rating === undefined)
    throw new Error("Invalid book review object, missing rating");

    if(review.username === undefined)
    throw new Error("Invalid book review object, missing username");

    let rating;
    try{
        rating = Number(review.rating);
    }
    catch(err){
        throw new Error("Rating must be a number");
    }

    if(review.ID.length < 8)
    throw new Error("ID must be at least 8 characters long");
    if(review.content.length < 2)
    throw new Error("Content must be at least 2 characters long");
    if(review.bookId.length < 2)
    throw new Error("Book ID must be at least 2 characters long");
    if(review.rating < 0 || review.rating > 5)
    throw new Error("Rating must be between 0 and 5");
    if(review.username.length < 2)
    throw new Error("Username must be at least 2 characters long");

    

    return true;
};

export default validBookReview;