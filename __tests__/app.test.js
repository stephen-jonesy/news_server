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
            const topics = body.topics;
            expect(Array.isArray(topics)).toBe(true);
            topics.forEach((topic) => {
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
            const articles = body.articles;
            expect(Array.isArray(articles)).toBe(true);
            expect(articles).toBeSortedBy("created_at", {
                descending: true,
            });
            articles.forEach((article) => {
                expect(article).toHaveProperty("author");
                expect(article).toHaveProperty("title");   
                expect(article).toHaveProperty("article_id");    
                expect(article).toHaveProperty("topic");    
                expect(article).toHaveProperty("created_at");    
                expect(article).toHaveProperty("votes");    
                expect(article).toHaveProperty("article_img_url");    
                expect(article).toHaveProperty("comment_count");    
                    
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
            const article = body.article[0];
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
            const comments = body.comments;
            expect(Array.isArray(comments)).toBe(true);
            expect(comments).toHaveLength(2);
            expect(comments).toBeSortedBy("created_at", {
                descending: true,
            });
            if(comments.length > 0){
                comments.forEach((comment) => {
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
            const comment = body.comment;
            const postedComment = comment[0].body
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


describe('GET /api/articles/:article_id/comments', () => {
    it('returns status 200 and an array of corresponding comment objects for the given article_id ', () => {
        return request(app)
        .get("/api/articles/3/comments")
        .expect(200)
        .then(({body})=> {
            const comments = body.comments;
            expect(Array.isArray(comments)).toBe(true);
            expect(comments).toHaveLength(2);
            expect(comments).toBeSortedBy("created_at", {
                descending: true,
            });
            if(comments.length > 0){
                comments.forEach((comment) => {
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
            const comment = body.comment
            const postedComment = comment[0].body
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
            expect(body[0].votes).toBe(101);

        })
    });
    it('returns status 200 and returned object with result of negative number being taken away from votes property', () => {

        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -101 })
        .expect(200)
        .then(({body}) => {
            expect(body[0].votes).toEqual(-1);

        })
    });
    it('returns status 400 when sent an invalid data type', () => {
        return request(app)
        .patch("/api/articles/1")
        .send({ invalid: -10 })
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Bad request');

        })
    });
});

describe('GET /api/users', () => {
    it('returns status 200 and returns all users, with properties of username, name, avatar_url ', () => {
        return request(app)
        .get('/api/users')
        .expect(200)
        .then(({body}) => {
            const firstUser = body.users[0];
            expect(Array.isArray(body.users)).toBe(true);
            expect(firstUser).toHaveProperty('username');
            expect(firstUser).toHaveProperty('name');
            expect(firstUser).toHaveProperty('avatar_url');

        })
        
    });
});