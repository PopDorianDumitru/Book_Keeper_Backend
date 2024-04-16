import  createTestExamples  from './createTestExamples';
import { describe, expect, test } from '@jest/globals';
import request from 'supertest';
import server from '../../index';

beforeAll(() => {
    createTestExamples();
});


afterAll(() => {
    server.close();
});

describe('testing book reviews get requests', () => {
    test('get all', async () => {
        const response = await request(server).get('/reviews');
        expect(response.status).toBe(200);
        expect(response.body.length).toBe(3);
    });

    test('get by id', async () => {
        const response = await request(server).get('/reviews/123456789');
        expect(response.status).toBe(200);
        expect(response.body.ID).toBe('123456789');
        expect(response.body.bookId).toBe('123456789');
        expect(response.body.username).toBe('John');
        expect(response.body.content).toBe('Great book');
        expect(response.body.userId).toBe('123456789');
        expect(response.body.rating).toBe(5);
    });

    test('get by inexistent id', async () => {
        const response = await request(server).get('/reviews/1');
        expect(response.status).toBe(404);
        expect(response.text).toBe('Book review not found');
    });

});
