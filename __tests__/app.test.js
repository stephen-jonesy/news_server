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

describe('GET /api/articles/:article_id', () => {
    it('returns 200 status and correct article by id ', () => {
        return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({body}) => {
            const article = body[0];
            expect(article instanceof Object).toBe(true);
            expect(article).toHaveProperty('article_id', 2);
            expect(article).toHaveProperty('title', 'Sony Vaio; or, The Laptop');
        })
    });
    it("returns 400 status when passed an article_id that doesn\'t exist", () => {
        return request(app)
        .get("/api/articles/75")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe("Opps, article does not exist");
        })
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

describe('PATCH /api/articles/:article_id', () => {
    it('returns status 200 and updated article with new votes value', () => {
        const returnedArticle = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: "2020-07-09T20:11:00.000Z",            
            votes: 101,
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        }
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({body}) => {
            console.log(body);
            expect(body[0]).toEqual(returnedArticle);

        })
    });
    it('returns status 200 and returned object with result of negative number being taken away from votes property', () => {
        const returnedArticle = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: "2020-07-09T20:11:00.000Z",            
            votes: -1,
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        }
        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -101 })
        .expect(200)
        .then(({body}) => {
            console.log(body);
            expect(body[0]).toEqual(returnedArticle);

        })
    });
    it('returns status 400 when sent an invalid data type', () => {
        const returnedArticle = {
            article_id: 1,
            title: 'Living in the shadow of a great man',
            topic: 'mitch',
            author: 'butter_bridge',
            body: 'I find this existence challenging',
            created_at: "2020-07-09T20:11:00.000Z",            votes: 90,
            article_img_url:
              'https://images.pexels.com/photos/158651/news-newsletter-newspaper-information-158651.jpeg?w=700&h=700',
        }
        return request(app)
        .patch("/api/articles/1")
        .send({ invalid: -10 })
        .expect(400)
        .then(({body}) => {
            console.log(body);
            expect(body.message).toBe('Bad request');

        })
    });
});