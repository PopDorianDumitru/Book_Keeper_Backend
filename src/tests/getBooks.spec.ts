import {describe, expect, test} from '@jest/globals';
import server from '../index';
import request from 'supertest';
import createTestExamples from './createTestExamples';


beforeAll(() => {
    createTestExamples();
});
afterAll(() => {
    server.close();
})

describe('testing backend', () => {
  test('get all',async() => {
   //Test if the response is 200 for getting books
    const response = await request(server).get('/books');
    expect(response.status).toBe(200);
    expect(response.body.length).toBe(3);
}),
    test('get by id',async() => {
        //Test if the response is 200 for getting book by id
        const response = await request(server).get('/books/1');
        expect(response.status).toBe(200);
        expect(response.body.ID).toBe('1');
        expect(response.body.title).toBe('The Great Gatsby');
        expect(response.body.author).toBe('F. Scott Fitzgerald');
        expect(response.body.language).toBe('English');
        expect(response.body.year).toBe(1925);
        
    })
});