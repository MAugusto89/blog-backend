const apiPosts = 'http://localhost:3000/users';
const loginEndPoint = `${apiPosts}/login`;

let userCredentials = {
    name: "Maicon Cezar",
    email: "maicon@gmail.com",
    password: "Ma1234567@"
}

describe("Testando API de postagens do blog", function () {
    const newUser = {name: 'Maicon Cezar', email: 'maicon@gmail.com', password: 'Ma1234567@'}

    it('Verify if it can register a new user', () => {
        cy.request("POST", apiPosts, newUser).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body.user).to.have.property('id');
            expect(response.body.user.name).to.eq(newUser.name)
        })
    });

    it('Verify if it can authenticate a new user', () => {
        cy.request("POST", loginEndPoint, userCredentials).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.body).to.have.property('token');
            expect(response.body.user.email).to.eq(userCredentials.email)
        })
    });

    it('Verify if it can remove a new user', () => {
        const deleteUserEndPoint = `${apiPosts}/maicon%40gmail.com`;

        cy.request("DELETE", deleteUserEndPoint).then((response) => {
            expect(response.status).to.eq(200);
            expect(response.headers['content-type']).to.include('application/json');
            
            
            expect(response.body).to.have.property('message', 'User deleted');
        })

    })
} );