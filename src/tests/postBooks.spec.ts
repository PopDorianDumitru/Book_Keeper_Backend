import server from "../index";
import {describe, expect, test} from "@jest/globals";
import request from "supertest";
import createTestExamples from './createTestExamples';


beforeAll(() => {
    createTestExamples();
});
afterAll(() => {
    server.close();
});

describe('Testing creating books', () => {
    test('post book', async () => {
        const response = await request(server)
            .post('/books')
            .send({
                ID: "12345678",
                title: "The stranger",
                author: "Albert Camus",
                year: 1942,
                language: "French"
            });
        expect(response.status).toBe(201);
        expect(response.body.ID).toBe("12345678");
        expect(response.body.title).toBe("The stranger");
        expect(response.body.author).toBe("Albert Camus");
        expect(response.body.year).toBe(1942);
        expect(response.body.language).toBe("French");
    });
    test('post book with invalid id', async () => {
        const response = await request(server)
            .post('/books')
            .send({
                ID: "5",
                title: "The stranger",
                author: "Albert Camus",
                year: 1942,
                language: "French"
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe("ID must be at least 8 characters long");
    });
    test('post book with invalid title', async () => {
        const response = await request(server)
            .post('/books')
            .send({
                ID: "12345678",
                title: "T",
                author: "Albert Camus",
                year: 1942,
                language: "French"
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Title must be at least 2 characters long");
    });    
    test('post book with invalid author', async () => {
        const response = await request(server)
            .post('/books')
            .send({
                ID: "12345678",
                title: "The stranger",
                author: "A",
                year: 1942,
                language: "French"
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Author must be at least 2 characters long");
    });
    test('post book with invalid language', async () => {
        const response = await request(server)
            .post('/books')
            .send({
                ID: "12345678",
                title: "The stranger",
                author: "Albert Camus",
                language: "F",
                year: 1942
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Language must be at least 2 characters long");
    });
    test('post book with invalid year', async () => {
        const response = await request(server)
            .post('/books')
            .send({
                ID: "12345678",
                title: "The stranger",
                author: "Albert Camus",
                language: "French",
                year: -19
            });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Year must be between 0 and " + (new Date().getFullYear() + 5));
    });
});