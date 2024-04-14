import server from "../../index"
import {describe, expect, test} from "@jest/globals"
import request from 'supertest';
import createTestExamples from "./createTestExamples";

beforeAll(()=>{
    createTestExamples();
})
afterAll(()=>{
    server.close();
})


describe('Testing creating book reviews', () => {
    test('create new review', async ()=>{
        const response = await request(server)
        .post('/reviews')
        .send({
            ID: "",
            content: "Honestly a decent book",
            bookId: "234567890",
            rating: 1,
            username: "soundboard1",
            userId: '6545647675'
        });
        expect(response.status).toBe(201);
        expect(response.body.content).toBe("Honestly a decent book");
        expect(response.body.rating).toBe(1);
        expect(response.body.bookId).toBe("234567890");
        expect(response.body.username).toBe("soundboard1");
        expect(response.body.userId).toBe("6545647675");
    })
    test('create review for nonexistent book', async()=>{
        const response = await request(server)
        .post('/reviews')
        .send({
            ID: "",
            content: "Honestly a decent book",
            bookId: "2345678900",
            rating: 1,
            username: "soundboard1",
            userId: "6545647675"
        });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Book not found");
    });

    test('create review with invalid content', async()=>{
        const response = await request(server)
        .post('/reviews')
        .send({
            ID: "",
            content: "",
            bookId: "234567890",
            rating: 1,
            username: "soundboard1",
            userId: '6545647675'
        });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Content must be at least 2 characters long");
    });

    test('create review with higher rating than possible', async()=>{
        const response = await request(server)
        .post('/reviews')
        .send({
            ID: "",
            content: "Honestly a decent book",
            bookId: "234567890",
            rating: 6,
            username: "soundboard1",
            userId: '6545647675'
        });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Rating must be between 0 and 5");
    });

    test('create review with lower rating than possible', async()=>{
        const response = await request(server)
        .post('/reviews')
        .send({
            ID: "",
            content: "Honestly a decent book",
            bookId: "234567890",
            rating: 6,
            username: "soundboard1",
            userId: '6545647675'
        });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Rating must be between 0 and 5");
    });

    test('create review with invalid username', async()=>{
        const response = await request(server)
        .post('/reviews')
        .send({
            ID: "",
            content: "Honestly a decent book",
            bookId: "234567890",
            rating: 1,
            username: "",
            userId: '6545647675'
        });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Username must be at least 2 characters long");
    });

    test('create review with missing content', async()=>{
        const response = await request(server)
        .post('/reviews')
        .send({
            ID: "",
            bookId: "234567890",
            rating: 1,
            username: "soundboard1",
            userId: '6545647675'
        });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Invalid book review object, missing content");
    });

    test('create review with missing bookId', async()=>{
        const response = await request(server)
        .post('/reviews')
        .send({
            ID: "",
            content: "Honestly a decent book",
            rating: 1,
            username: "soundboard1",
            userId: '6545647675'
        });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Invalid book review object, missing bookId");
    });

    test('create review with missing rating', async()=>{
        const response = await request(server)
        .post('/reviews')
        .send({
            ID: "",
            content: "Honestly a decent book",
            bookId: "234567890",
            username: "soundboard1",
            userId: '6545647675'
        });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Invalid book review object, missing rating");
    });

    test('create review with missing username', async()=>{
        const response = await request(server)
        .post('/reviews')
        .send({
            ID: "",
            content: "Honestly a decent book",
            bookId: "234567890",
            rating: 1,
            userId: '6545647675'
        });
        expect(response.status).toBe(400);
        expect(response.text).toBe("Invalid book review object, missing username");
    });



});