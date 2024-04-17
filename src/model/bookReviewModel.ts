import bookReviewInMemory from "./bookReviewInMemoryModel";
import bookReviewPostgres from "./bookReviewPostgresModel";

export default process.env.NODE_ENV === "test" ? bookReviewInMemory : bookReviewPostgres;