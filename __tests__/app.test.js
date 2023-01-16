const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index")
const request = require("supertest");
const app = require("../app");

beforeEach(() => {
    return seed(data);
});

afterAll(() => {
    return db.end();
});

describe('get /api/topics', () => {
    it('returns status 200 and an array of all topic objects with correct properties', () => {
        return request(app)
        .get("/api/topics")
        .expect(200)
        .then(({body})=> {
            expect(Array.isArray(body)).toBe(true);
            body.forEach((topic) => {
                expect(topic).toHaveProperty("description");
                expect(topic).toHaveProperty("slug");    
                    
            });
        })
    });
    it('returns status 404 for a bad endpoint', () => {
        return request(app)
        .get("/api/topic")
        .expect(404)

    });
    
});

describe('get  /api/articles/:article_id/comments', () => {
    it('returns status 200 and an array of corresponding comment objects for the given article_id ', () => {
        return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({body})=> {
            expect(Array.isArray(body)).toBe(true);
            expect(body.length).toBe(2);
            body.forEach((comment) => {
                expect(comment).toHaveProperty("comment_id");
                expect(comment).toHaveProperty("votes");    
                expect(comment).toHaveProperty("created_at");    
                expect(comment).toHaveProperty("author");    
                expect(comment).toHaveProperty("body");    
                expect(comment).toHaveProperty("article_id");    

            });            

        })
    });
    it('Returns 404 status and a message for an article_id that does not correspond to any comments ', () => {
        return request(app)
        .get("/api/articles/75/comments")
        .expect(404)
        .then(({body}) => {
            console.log(body.message);
            expect(body.message).toBe('Opps, no comments found');
        })
    });
    it('Returns 400 status and and a bad request message when passed wrong data type', () => {
        return request(app)
        .get("/api/articles/baddata/comments")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Bad request');
        })
    });

});
