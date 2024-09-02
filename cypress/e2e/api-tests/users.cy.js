const apiPosts = 'http://localhost:3000/users';
const loginEndPoint = `${apiPosts}/login`;

let userCredentials = {
    name: "Maicon Cezar",
    email: "maicon@gmail.com",
    password: "Ma1234567@"
}

describe("Testando API de postagens do blog", function () {
    const newUser = {name: 'Maicon Cezar', email: 'maicon@gmail.com', password: 'Ma1234567@'}
    const newUser2 = {name: 'Me', email: 'maicon2@gmail.com', password: 'Ma1234567@'}
    const newUser3 = {name: 'Mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm', email: 'maicon3@gmail.com', password: 'Ma1234567@'}
    const newUser4 = {name: 'Maicon Cezar A', email: 'maicon4@gmail.com', password: '123'}
    const newUser5 = {name: 'Maicon Cezar A C', email: 'maicon5@gmail.com', password: 'Ma1234567@2'}

    it('Verify if it can register a new user', () => {
        cy.request("POST", apiPosts, newUser).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.user).to.have.property('id');
            expect(response.body.user.name).to.eq(newUser.name)
        })
    });
    it("Verify if it can't register a new user with email already existing", () => {
        cy.request({method: "POST", url: apiPosts, body: newUser, failOnStatusCode: false}).then((response) => {
            expect(response.status).to.eq(400);

            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body.messages[0]).to.have.eq('A user with this email already exists');
            
        })
    });

    it("Verify if it can't register a new user with name less than 5 characters", () => {
        cy.request({method: "POST", url: apiPosts, body: newUser2, failOnStatusCode: false}).then((response) => {
            expect(response.status).to.eq(400);

            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body.messages[0]).to.have.eq('User name must have between 5 and 50 characters');
        })
    });

    it("Verify if it can't register a new user with name more than 50 characters", () => {
        cy.request({method: "POST", url: apiPosts, body: newUser3, failOnStatusCode: false}).then((response) => {
            expect(response.status).to.eq(400);

            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body.messages[0]).to.have.eq('User name must have between 5 and 50 characters');
        })
    });

    it("Verify if it can't register a new user with password without formatation", () => {
        cy.request({method: "POST", url: apiPosts, body: newUser4, failOnStatusCode: false}).then((response) => {
            expect(response.status).to.eq(400);

            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body.messages[0]).to.have.eq('Password must contain at least 8 characters, 1 uppercase character, and 1 digit');
        })
    });

    it('Verify if it can authenticate a new user', () => {
        cy.request("POST", loginEndPoint, userCredentials).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            expect(response.body.user.email).to.eq(userCredentials.email)
        })
    });
    it("Verify if it can't authenticate a strange user", () => {
        cy.request({method: "POST", url: loginEndPoint, body: newUser4 , failOnStatusCode: false}).then((response) => {
            expect(response.status).to.eq(401);
            expect(response.headers['content-type']).to.include('application/json');
            expect(response.body).to.have.property( "message", "User not authorized");
        })
    });

    it('Verify if it can remove a new user', () => {
        const deleteUserEndPoint = `${apiPosts}/maicon%40gmail.com`;

        cy.request("DELETE", deleteUserEndPoint).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.headers['content-type']).to.include('application/json'); 
            
            expect(response.body).to.have.property('message', 'User deleted');
        })
    });

    it("Verify if it can't remove a user with email without formatation", () => {
        const deleteUserEndPoint = `${apiPosts}/maicon`;

        cy.request({method: "DELETE", url: deleteUserEndPoint, failOnStatusCode: false}).then((response) => {
            expect(response.status).to.eq(400);
            expect(response.headers['content-type']).to.include('application/json'); 
            
            expect(response.body).to.have.property('message', 'Invalid e-mail');
        })
    });

    it("Verify if it can't remove a strange user", () => {
        const deleteUserEndPoint = `${apiPosts}/maiconD%40gmail.com`;

        cy.request({method: "DELETE", url: deleteUserEndPoint, failOnStatusCode: false}).then((response) => {
            expect(response.status).to.eq(404);
            expect(response.headers['content-type']).to.include('application/json'); 
            
            expect(response.body).to.have.property('message', 'User not found');
        })
    });
} );

