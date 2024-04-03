import {describe, expect, test} from '@jest/globals';
import request from 'supertest';
import server from '../index.ts';
import createTestExamples from './createTestExamples';


beforeAll(() => {
    createTestExamples();
});
afterAll(() => {
    server.close();
})

describe('testing deleting books', () => {
    test('delete existing book', async() => {
        const response = await request(server).delete('/books/1');
        expect(response.status).toBe(204);
    });
    test('delete non-existing book', async() => {
        const response = await request(server).delete('/books/1');
        expect(response.status).toBe(404);
    });
});