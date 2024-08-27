const apiPosts = 'http://localhost:3000/users'

describe("Testando API de postagens do blog", function () {
    // it('Verify if posts GET method', () => {
    //     cy.request("GET", apiPosts).then((response) => {
    //         expect(response.status).to.eq(200)
    //       })
    // });

    it('Verify if I can register a new user', () => {
        const newUser = {name: 'Maicon Cezar', email: 'maicon@gmail.com', password: 'Ma1234567@'}

        cy.request("POST", apiPosts, newUser).then((response) => {
            expect(response.status).to.eq(201);
            expect(response.body).to.have.property('id');
            expect(response.body.name).to.eq(newUser.name)
        })
    })
} );