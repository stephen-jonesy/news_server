const db = require("../db/connection");
const seed = require("../db/seeds/seed");
const data = require("../db/data/test-data/index")
const request = require("supertest");
const app = require("../app");
const sorted = require("jest-sorted");

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
            console.log(body);
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

describe('Name of the group', () => {
    it('returns status 200 and an array of all articles objects with correct properties', () => {
        return request(app)
        .get("/api/articles")
        .expect(200)
        .then(({body})=> {
            expect(Array.isArray(body)).toBe(true);
            expect(body).toBeSortedBy("created_at", {
                descending: true,
            });
            body.forEach((topic) => {
                expect(topic).toHaveProperty("author");
                expect(topic).toHaveProperty("title");   
                expect(topic).toHaveProperty("article_id");    
                expect(topic).toHaveProperty("topic");    
                expect(topic).toHaveProperty("created_at");    
                expect(topic).toHaveProperty("votes");    
                expect(topic).toHaveProperty("article_img_url");    
                expect(topic).toHaveProperty("comment_count");    
                    
            });
            
        })
    })
    it('returns status 404 for a bad endpoint', () => {
        return request(app)
        .get("/api/article")
        .expect(404)

    });
});
