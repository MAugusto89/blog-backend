const apiPosts = 'http://localhost:3000/posts';
const apiUsers = 'http://localhost:3000/users';
const loginEndPoint = `${apiUsers}/login`;

let userCredentials = {
    name: "Maicon Cezar Real",
    email: "maiconReal@gmail.com",
    password: "Ma1234567@"
}
let postId;
let postIds = [];

describe("Testando API de postagens do blog", function () {
   before(() => {
    cy.request("POST", apiUsers, userCredentials)
        .then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.user).to.have.property('id');
            postId = response.body.user.id;
            postIds.push(response.body.user.id)
            expect(response.body.user.name).to.eq(userCredentials.name);

            return cy.request("POST", loginEndPoint, userCredentials);
        })
        .then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            expect(response.body.user.email).to.eq(userCredentials.email);

            Cypress.env('authToken', response.body.token);
        });
   });

   let newPost = {
    title: "Learning programming with Go",
    content: "Go is a very popular programming language, which is great for learning programming logics."
   }

   it('Verify if it can register a new post', () => {
        cy.request({method: "POST", url: apiPosts, body: newPost, headers:{Authorization: `Bearer ${Cypress.env('authToken')}`}, failOnStatusCode: false}).then((response) => {
            expect(response.headers['content-type']).to.include('application/json');
            
            expect(response.body).to.have.property('post').that.is.an('object');
            expect(response.body.post).to.have.property('id').that.is.a('number');
          })
    });

    let newPost1 = {
    title: "A",
    content: "Go is a very popular programming language, which is great for learning programming logics."
   }

   it("Verify if it can't register a new post with wrong title", () => {
        cy.request({method: "POST", url: apiPosts, body: newPost1, headers:{Authorization: `Bearer ${Cypress.env('authToken')}`}, failOnStatusCode: false}).then((response) => {

            expect(response.status).to.eq(400);

            expect(response.headers['content-type']).to.include('application/json');

            expect(response.body).to.have.property('messages').that.is.an('array');

            expect(response.body.messages).to.include("Post title must have between 5 and 30 characters");
          })
    });

    let newPost2 = {
    title: "Learning programming with Go",
    content: "Go."
   }

   it("Verify if it can't register a new post with wrong content", () => {
        cy.request({method: "POST", url: apiPosts, body: newPost2, headers:{Authorization: `Bearer ${Cypress.env('authToken')}`}, failOnStatusCode: false}).then((response) => {

            expect(response.status).to.eq(400);

            expect(response.headers['content-type']).to.include('application/json');

            expect(response.body).to.have.property('messages').that.is.an('array');

            expect(response.body.messages).to.include("Post content must have between 5 and 144 characters");
          })
    });

   it("Verify if it can't register a new post without authorization", () => {
        cy.request({method: "POST", url: apiPosts, body: newPost1, failOnStatusCode: false}).then((response) => {

            expect(response.status).to.eq(401);

            expect(response.headers['content-type']).to.include('application/json');

            expect(response.body).to.have.property('message', 'User not authorized');
          })
    });

    it("Verify if it can retrieve all posts", () => {
        cy.request({method: "GET", url: apiPosts, failOnStatusCode: false}).then((response) => {

            expect(response.status).to.eq(200);

            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body).to.have.property('posts').that.is.an('array');


            response.body.posts.forEach(post => {
                expect(post).to.have.all.keys('id', 'title', 'content');
                expect(post.title).to.be.a('string').and.not.be.empty;
                expect(post.content).to.be.a('string').and.not.be.empty;
            });
          })
    });

    it("Verify if it can retrieve a post by its id", () => {
        const postEndPoint = `${apiPosts}/${postId}`
        console.log(postId)
        cy.request({method: "GET", url: postEndPoint, failOnStatusCode: false}).then((response) => {

            expect(response.status).to.eq(200);

            expect(response.headers['content-type']).to.include('application/json');

            expect(response.body).to.have.property('post').that.is.an('object');

            expect(response.body.post).to.have.all.keys('id', 'title', 'content', 'user');
            expect(response.body.post.id).to.eq(postId);
            expect(response.body.post.title).to.be.a('string').and.not.be.empty;
            expect(response.body.post.content).to.be.a('string').and.not.be.empty;

            expect(response.body.post.user).to.have.all.keys('id', 'name', 'email');
            expect(response.body.post.user.id).to.be.a('number');
            expect(response.body.post.user.name).to.be.a('string').and.not.be.empty;
            expect(response.body.post.user.email).to.be.a('string').and.not.be.empty;
            
          })
    });
    
    it("Verify if it can't return a post by a wrong id", () => {
        const wrongId = 999;
        const postEndPoint = `${apiPosts}/${wrongId}`
        cy.request({method: "GET", url: postEndPoint, failOnStatusCode: false}).then((response) => {

            expect(response.status).to.eq(404);

            expect(response.headers['content-type']).to.include('application/json');

            expect(response.body).to.have.property('message', 'Post not found')

            
            
          })
    });

    it("Verify if it can't return a post by a invalid id", () => {
        const wrongId = "aaa";
        const postEndPoint = `${apiPosts}/${wrongId}`
        cy.request({method: "GET", url: postEndPoint, failOnStatusCode: false}).then((response) => {

            expect(response.status).to.eq(400);

            expect(response.headers['content-type']).to.include('application/json');

            expect(response.body).to.have.property('message', "Invalid id") 
          })
    });

    it("Verify if it can retrieve all posts by it's giving id", () => {
        
        const userPosts = `${apiPosts}/user/${postId}`
        cy.request({method: "GET", url: userPosts, failOnStatusCode: false}).then((response) => {

            expect(response.status).to.eq(200);

            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body).to.have.property('posts').that.is.an('array');


            response.body.posts.forEach(post => {
                expect(post).to.have.all.keys('id', 'title', 'content');
                expect(post.id).to.be.oneOf(postIds);
                expect(post.title).to.be.a('string').and.not.be.empty;
                expect(post.content).to.be.a('string').and.not.be.empty;
            });
          })
    });

    it("Verify if it can't remove a post without authorization", () => {
        const invalidId = "1"
        const deletePostEndPoint = `${apiPosts}/${invalidId}`;

        cy.request({method: "DELETE", url: deletePostEndPoint, failOnStatusCode: false}).then((response) => {
            expect(response.status).to.eq(401);

            expect(response.headers['content-type']).to.include('application/json');

            expect(response.body).to.have.property('message', 'User not authorized');
        })
    });

    it('Verify if it can remove a post', () => {
        const deletePostEndPoint = `${apiPosts}/${postId}`;

        cy.request({method: "DELETE", url: deletePostEndPoint, headers:{Authorization: `Bearer ${Cypress.env('authToken')}`}}).then((response) => {
            expect(response.status).to.be.oneOf([200, 204]);
            expect(response.headers['content-type']).to.include('application/json'); 
            
            expect(response.body).to.have.property('message', 'Post deleted');
        })
    });

    it("Verify if it can't remove a post by giving it a invalid id", () => {
        const invalidId = "aaa"
        const deletePostEndPoint = `${apiPosts}/${invalidId}`;

        cy.request({method: "DELETE", url: deletePostEndPoint, failOnStatusCode: false, headers:{Authorization: `Bearer ${Cypress.env('authToken')}`}}).then((response) => {
            expect(response.status).to.eq(400);
            
            expect(response.body).to.have.property('message', 'Invalid id');
        })
    });

    it("Verify if it can't remove a post that was not found", () => {
        const invalidId = "1"
        const deletePostEndPoint = `${apiPosts}/${invalidId}`;

        cy.request({method: "DELETE", url: deletePostEndPoint, failOnStatusCode: false}).then((response) => {
            expect(response.status).to.eq(401);

            expect(response.headers['content-type']).to.include('application/json');

            expect(response.body).to.have.property('message', 'User not authorized');
        })
    });

    

   after(() => {

        const deleteUserEndPoint = `${apiUsers}/maiconReal%40gmail.com`;
        cy.request("DELETE", deleteUserEndPoint).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.headers['content-type']).to.include('application/json'); 
            
            expect(response.body).to.have.property('message', 'User deleted');
        });
    });
})

