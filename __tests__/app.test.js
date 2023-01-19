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
            expect(topics.length).toBe(3);

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
            expect(articles).toHaveLength(12);
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
    it('returns 200 status and queried articles but topic when endpoint contains a topic query', () => {
        return request(app)
        .get("/api/articles?topic=cats")
        .expect(200)
        .then(({body}) => {
            expect(body.articles.length > 0).toBe(true)
            body.articles.forEach((article)=> {
                expect(article).toEqual(
                    expect.objectContaining({topic: 'cats'})
    
                );
            });

        });
    });
    it('returns 200 status and sorts articles by sortBy when endpoint contains a sortBy query ', () => {
        return request(app)
        .get("/api/articles?sort_by=author")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy("author", {
                descending: true,
            });
        });
    });
    it('returns 200 status and orders created_by by ascending', () => {
        return request(app)
        .get("/api/articles?order=asc")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy("created_at", {
                descending: false,
            });
        });
    });
    it('returns 200 status and sorts articles by author in ascending order', () => {
        return request(app)
        .get("/api/articles?sort_by=author&order=asc")
        .expect(200)
        .then(({body}) => {
            expect(body.articles).toBeSortedBy("author", {
                descending: false,
            });
        });
    });
    it('returns 200 and message if topic category doesn\'t exist', () => {
        return request(app)
        .get("/api/articles?topic=stuff")
        .expect(200)
        .then(({body}) => {
            expect(body.message).toBe("Topic doesn't exist");
        })
    });
    it('returns status of 400 and error message when passed an invalid sort_by query ', () => {
        return request(app)
        .get("/api/articles?sort_by=stuff")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Invalid sort query');
        })
    });
    it('returns status of 400 and error message when passed an invalid order query ', () => {
        return request(app)
        .get("/api/articles?order=stuff")
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Invalid order query');
        })
    });

});

describe('GET /api/articles/:article_id', () => {
    it('returns 200 status and correct article by id ', () => {
        return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({body}) => {
            const article = body.article;
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
    it('returns status of 200 with a comment_count property ', () => {
        return request(app)
        .get("/api/articles/2")
        .expect(200)
        .then(({body}) => {
            const article = body.article;
            expect(article).toHaveProperty('comment_count', '0');

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
            comments.forEach((comment) => {
                expect(comment).toHaveProperty("comment_id");
                expect(comment).toHaveProperty("votes");    
                expect(comment).toHaveProperty("created_at");    
                expect(comment).toHaveProperty("author");    
                expect(comment).toHaveProperty("body");    
                expect(comment).toHaveProperty("article_id");    

            });    
        })
    });
    it('Returns 404 status and message when article does not exist ', () => {
        return request(app)
        .get("/api/articles/10000/comments")
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
        const sendComment = {
            username: 'rogersop',
            body: 'lorem ipsum'
        }
        return request(app)
        .post("/api/articles/1/comments")
        .send(sendComment)
        .expect(201)
        .then(({body})=> {
            const postedComment = body.body;
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

describe('PATCH /api/articles/:article_id', () => {
    it('returns status 200 and updated article with new votes value', () => {


        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: 1 })
        .expect(200)
        .then(({body}) => {
            expect(body.article).toEqual(
                expect.objectContaining({
                    article_id: 1,
                    votes: 101
                })
            )
           
            expect(body.article).toEqual(
                expect.objectContaining({
                    article_id: 1,
                    votes: 101
                })
            )
           
        })
    });
    it('returns status 200 and returned object with result of negative number being taken away from votes property', () => {

        return request(app)
        .patch("/api/articles/1")
        .send({ inc_votes: -101 })
        .expect(200)
        .then(({body}) => {
            
            expect(body.article).toEqual(
                expect.objectContaining({
                    article_id: 1,
                    votes: -1
                })
            );

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
            const users = body.users;
            expect(users).toHaveLength(4);
            expect(Array.isArray(users)).toBe(true);
            users.forEach((user) => {
                expect(user).toHaveProperty("username");
                expect(user).toHaveProperty("name");    
                expect(user).toHaveProperty("avatar_url");      

            });    
        })
    });
});

describe('DELETE /api/comments/:comment_id', () => {
    it('returns status of 204 when sent the correct id and comment is removed from the comments table', () => {
        return request(app)
        .delete('/api/comments/1')
        .expect(204)
        .then(() => {
            db.query('SELECT * FROM comments WHERE comment_id = 1;')
            .then((result) => {
                expect(result.rows).toHaveLength(0)

            })
        })
    });
    it('returns status 404 when comment_id does not exist', () => {
        return request(app)
        .delete('/api/comments/1000')
        .expect(404)
        .then(({body}) => {
            expect(body.message).toBe('Opps, comment does not exist');
        })

    });
    it('returns status 404 when comment_id does not exist', () => {
        return request(app)
        .delete('/api/comments/stuff')
        .expect(400)
        .then(({body}) => {
            expect(body.message).toBe('Bad request');
        })

    });
});

describe('GET /api', () => {
    it('returns a status: 200 and a JSON object ', () => {
        return request(app)
        .get('/api')
        .expect(200)
        .then(({body}) => {
            expect(typeof body.data).toBe("string");

        })
    });
});
