import bookInMemoryModel from "./bookInMemoryModel";
import bookPostgresModel from "./bookPostgresModel";

export default process.env.NODE_ENV === "test" ? bookInMemoryModel : bookPostgresModel;