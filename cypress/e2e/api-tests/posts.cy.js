const apiPosts = 'http://localhost:3000/posts'

describe("Testando API de postagens do blog", function () {
    it('Verify if posts GET method', () => {
        cy.request("GET", apiPosts).then((response) => {
            expect(response.status).to.eq(200)
          })
    })
} );