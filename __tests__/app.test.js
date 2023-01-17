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

describe('GET /api/topics', () => {
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
describe('GET /api/articles', () => {
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
    it('returns 200 status and queried articles but topic when endpoint contains a topic query', () => {
        return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({body}) => {
            expect(body[0]).toHaveProperty('topic', 'cats')
        })
    });
    it('returns 200 status and sorts articles by sortBy when endpoint contains a sortBy query ', () => {
        return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({body}) => {
            expect(body).toBeSortedBy("author", {
                descending: true,
            });
        });
    });
    it('returns 200 status and orders created_by by ascending', () => {
        return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({body}) => {
            expect(body).toBeSortedBy("created_at", {
                descending: false,
            });
        });
    });
    it('returns 200 status and sorts articles by author in ascending order', () => {
        return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then(({body}) => {
            expect(body).toBeSortedBy("author", {
                descending: false,
            });
        });
    });
    it('returns status of 404 from passed an invalid query ', () => {
        return request(app)
        .get("/api/articles?sort_by=stuff")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Invalid sort query');
        })
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


describe('GET /api/articles/:article_id/comments', () => {
    it('returns status 200 and an array of corresponding comment objects for the given article_id ', () => {
        return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({body})=> {
            expect(Array.isArray(body)).toBe(true);
            expect(body).toHaveLength(2);
            expect(body).toBeSortedBy("created_at", {
                descending: true,
            });
            if(body.length > 0){
                body.forEach((comment) => {
                    expect(comment).toHaveProperty("comment_id");
                    expect(comment).toHaveProperty("votes");    
                    expect(comment).toHaveProperty("created_at");    
                    expect(comment).toHaveProperty("author");    
                    expect(comment).toHaveProperty("body");    
                    expect(comment).toHaveProperty("article_id");    
    
                });    
            }        
        })
    });
    it('Returns 404 status and message when article does not exist ', () => {
        return request(app)
        .get("/api/articles/77/comments")
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('Opps, article does not exist');
        })
    });
    it('Returns 200 status and a message for an article_id that does not correspond to any comments ', () => {
        return request(app)
        .get("/api/articles/2/comments")
        .expect(200)
        .then(({body}) => {
            expect(body.message).toBe('No comments found');
        })
    });
    it('Returns 400 status and and a bad request message when passed wrong data type for article_id', () => {
        return request(app)
        .get("/api/articles/baddata/comments")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Bad request');
        })
    });

});


describe('POST /api/articles/:article_id/comments', () => {
    it('returns with a status: 201 and responds with the posted comment', () => {
        const comment = {
            username: 'rogersop',
            body: 'lorem ipsum'
        }
        return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(201)
        .then(({body})=> {
            const postedComment = body[0].body
            expect(postedComment).toBe('lorem ipsum');
        })
    });
    it('returns with a status: 400 when all necessary properties are not sent to the server', () => {
        const comment = {
            username: 'rogersop',
        }
        return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe("Bad request");
        });
    });
    it('returns with 400 for an invalid data-type', () => {
        const comment = {
            stuff: 'bad data',
            body: 'lorem ipsum'

        }
        return request(app)
        .post("/api/articles/1/comments")
        .send(comment)
        .expect(400)
        .then(({ body }) => {
            expect(body.message).toBe("Bad request");
        });
    });
    it('returns with 404 if article does not exist', () => {
        const comment = {
            username: 'rogersop',
            body: 'lorem ipsum'

        }
        return request(app)
        .post("/api/articles/87/comments")
        .send(comment)
        .expect(404)
        .then(({ body }) => {
            expect(body.message).toBe("Not found");
        });
    });
});
