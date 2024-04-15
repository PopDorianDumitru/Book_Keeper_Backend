import createTestExamples from "./createTestExamples";
import request from 'supertest';
import server from '../../index';



beforeAll(() => {
    createTestExamples();
})

afterAll(()=>{
    server.close();
})

describe("Testing getting book reviews by book id", () => {
    test('get all reviews for a book', async () => {
        const response = await request(server).get('/reviews/book/123456789');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(2);
        expect(response.body[0].ID).toBe('123456789');
        expect(response.body[0].bookId).toBe('123456789');
        expect(response.body[0].username).toBe('John');
        expect(response.body[0].content).toBe('Great book');
        expect(response.body[0].userId).toBe('123456789');
        expect(response.body[0].rating).toBe(5);
        expect(response.body[1].ID).toBe('234567890');
        expect(response.body[1].bookId).toBe('123456789');
        expect(response.body[1].username).toBe('Jane');
        expect(response.body[1].content).toBe('Not a great book');
        expect(response.body[1].userId).toBe('234567890');
        expect(response.body[1].rating).toBe(2);
    });
    test('get all reviews for a non-existent book', async () => {
        const response = await request(server).get("/reviews/book/1");
        expect(response.body.length).toBe(0);
    });
});