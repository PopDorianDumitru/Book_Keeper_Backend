import request from 'supertest';
import server from '../../index';
import createTestExamples from './createTestExamples';
import {beforeAll, afterAll, describe} from '@jest/globals';
import bookReviewList from '../../model/bookReviewModel';

beforeAll(()=>{
    createTestExamples();

});



afterAll(()=>{
    server.close();
});

describe('testing patching book reviews', () => {
    test('patch non-existent book review', async() => {
        const response = await request(server)
            .patch('/reviews/1')
            .send({
                content: "fdsfsd"
            });
        expect(response.status).toBe(404);
        expect(response.text).toBe("Book review not found");
    });

    test('patch book review content', async() => {
        const response = await request(server)
            .patch('/reviews/123456789')
            .send({
                content: "The Newer Gatsby is a great book",
            });
        expect(response.status).toBe(200);
        expect(response.body.content).toBe("The Newer Gatsby is a great book");
        expect(response.body.rating).toBe(5);
        expect(response.body.bookId).toBe("123456789");
        expect(response.body.ID).toBe("123456789");
        expect(response.body.username).toBe("John")
    });


    test('patch book review rating', async() => {
        const response = await request(server)
            .patch('/reviews/123456789')
            .send({
                rating: 4,
            });
        expect(response.status).toBe(200);
        expect(response.body.content).toBe("The Newer Gatsby is a great book");
        expect(response.body.rating).toBe(4);
        expect(response.body.bookId).toBe("123456789");
        expect(response.body.ID).toBe("123456789");
        expect(response.body.username).toBe("John")
    });

    test('patch book review username', async() => {
        const response = await request(server)
            .patch('/reviews/123456789')
            .send({
                username: "John Doe",
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Username cannot be changed");
    });

    test('patch book review bookId', async() => {
        const response = await request(server)
            .patch('/reviews/123456789')
            .send({
                bookId: "123456788",
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Book ID cannot be changed");
    });

    test('patch book review ID', async() => {
        const response = await request(server)
            .patch('/reviews/123456789')
            .send({
                ID: "123456788",
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Book review ID cannot be changed");
    });

    test('patch book everything', async() => {

        const response = await request(server)
            .patch('/reviews/123456789')
            .send({
                content: "The Even Newer Gatsby is a great book",
                rating: 4,
            });
        expect(response.status).toBe(200);
        expect(response.body.content).toBe("The Even Newer Gatsby is a great book");
        expect(response.body.rating).toBe(4);
        expect(response.body.bookId).toBe("123456789");
        expect(response.body.ID).toBe("123456789");
        expect(response.body.username).toBe("John")
    });
    


});