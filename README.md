# Book Keeper Backend

This is a backend application built with Node.js and TypeScript that sets up an API for handling books. It follows the MVC (Model-View-Controller) design pattern and includes tests and validators.

## Getting Started

1. Clone this repository:

   ```bash
   git clone https://github.com/your-username/book-keeper-backend.git
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

3. Set up the environment variables:

   - Create a `.env` file in the root directory.
   - Add the following variables:

     ```plaintext
     PORT=8080
     ```

4. Run the application:

   ```bash
   npm start
   ```

## API Endpoints

The following API endpoints are available:

- `GET /books`: Get all books.
- `GET /books/:id`: Get a specific book by ID.
- `POST /books`: Create a new book.
- `patch /books/:id`: Update a book by ID.
- `DELETE /books/:id`: Delete a book by ID.

## Testing

To run the tests, use the following command: npm run test
