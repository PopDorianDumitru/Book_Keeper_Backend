import server from "../../index";
import createTestExamples from "./createTestExamples"
import request from 'supertest';
import { describe, expect, test, afterAll, beforeAll } from '@jest/globals';

beforeAll(()=>{
    createTestExamples();
})

afterAll(()=>{
    server.close();
});

describe('testing deleting book reviews', () => {
    test('delete existing book review', async () => {
        const response = await request(server).delete('/reviews/123456789');
        expect(response.status).toBe(204);
    });
    test('delete non-existing book review', async () => {
        const response = await request(server).delete('/reviews/1');
        expect(response.status).toBe(404);
        expect(response.text).toBe("Book review not found");
    });
});