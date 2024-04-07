import  wss from "../sockets/socket";
const users = ["StephKing", "JRRTOken", "ROOTHFuss", "RRMartin_never_finish"]
const reviews = ["This book is amazing", "This book is terrible", "This book is okay", "This book is the best book ever",
    "You need a very high IQ for this book🤓"
]


let bookReview = {
    "user": "RasNothingWrong",
    "review": "This book is amazing",
}

const reviewGenerator = () => {
    const generateReview = () => {
        console.log("Generating review");
        let user = users[Math.floor(Math.random() * users.length)];
        let review = reviews[Math.floor(Math.random() * reviews.length)];
        bookReview.user = user;
        bookReview.review = review;
        console.log(bookReview)
        wss.clients.forEach((client) => {
            client.send(JSON.stringify(bookReview));
        });

        // Schedule the next review
        const nextInterval = Math.floor(Math.random() * 5000) + 10000; // Random interval between 1000 and 6000 milliseconds
        setTimeout(generateReview, nextInterval);
    }

    // Generate the first review
    generateReview();
}
reviewGenerator();
