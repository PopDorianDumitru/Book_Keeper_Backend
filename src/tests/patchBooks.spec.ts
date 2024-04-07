import {test, describe, expect} from '@jest/globals';
import request from 'supertest';
import server from '../index.ts';
import createTestExamples from './createTestExamples';


beforeAll(() => {
    createTestExamples();
});
afterAll(() => {
    server.close();
});

describe('testing patching books', () => {
    test('patch title book', async() => {
        const response = await request(server)
            .patch('/books/1')
            .send({
                ID: "123456789",
                title: "The Newer Gatsby",
            });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("The Newer Gatsby");
        expect(response.body.author).toBe("F. Scott Fitzgerald");
        expect(response.body.language).toBe("English");
        expect(response.body.year).toBe(1925);
    });
    test('patch author book', async() => {
        const response = await request(server)
            .patch('/books/123456789')
            .send({
                author: "F. Scott Fitzgerald Jr.",
            });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("The Newer Gatsby");
        expect(response.body.author).toBe("F. Scott Fitzgerald Jr.");
        expect(response.body.language).toBe("English");
        expect(response.body.year).toBe(1925);
    });
    test('patch language book', async() => {
        const response = await request(server)
            .patch('/books/123456789')
            .send({
                language: "Spanish",
            });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("The Newer Gatsby");
        expect(response.body.author).toBe("F. Scott Fitzgerald Jr.");
        expect(response.body.language).toBe("Spanish");
        expect(response.body.year).toBe(1925);
    });
    test('patch year book', async() => {
        const response = await request(server)
            .patch('/books/123456789')
            .send({
                year: 2021,
            });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("The Newer Gatsby");
        expect(response.body.author).toBe("F. Scott Fitzgerald Jr.");
        expect(response.body.language).toBe("Spanish");
        expect(response.body.year).toBe(2021);
    });
    test('patch all book', async() => {
        const response = await request(server)
            .patch('/books/123456789')
            .send({
                title: "The Even Newer Gatsby",
                author: "F. Scott Fitzgerald Jr. Jr.",
                language: "Spanishx2",
                year: 2022,
            });
        expect(response.status).toBe(200);
        expect(response.body.title).toBe("The Even Newer Gatsby");
        expect(response.body.author).toBe("F. Scott Fitzgerald Jr. Jr.");
        expect(response.body.language).toBe("Spanishx2");
        expect(response.body.year).toBe(2022);
    });
    test('patch non-existing book', async() => {
        const response = await request(server)
            .patch('/books/1234567890')
            .send({
                title: "The Even Newer Gatsby",
            });
        expect(response.status).toBe(404);
    });
});