"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const socket_1 = __importDefault(require("../sockets/socket"));
const reviewModel_1 = __importDefault(require("../model/reviewModel"));
const users = ["StephKing", "JRRTOken", "ROOTHFuss", "RRMartin_never_finish"];
const reviews = ["This book is amazing", "This book is terrible", "This book is okay", "This book is the best book ever",
    "You need a very high IQ for this book🤓"
];
let bookReview = {
    "user": "RasNothingWrong",
    "review": "This book is amazing",
};
const reviewGenerator = () => {
    if (process.env.NODE_ENV === 'test')
        return;
    const generateReview = () => {
        console.log("Generating review");
        let user = users[Math.floor(Math.random() * users.length)];
        let review = reviews[Math.floor(Math.random() * reviews.length)];
        bookReview = { user, review };
        reviewModel_1.default.push(bookReview);
        console.log(bookReview);
        socket_1.default.clients.forEach((client) => {
            client.send(JSON.stringify(bookReview));
        });
        // Schedule the next review
        const nextInterval = Math.floor(Math.random() * 5000) + 10000; // Random interval between 1000 and 6000 milliseconds
        setTimeout(generateReview, nextInterval);
    };
    // Generate the first review
    generateReview();
};
reviewGenerator();
