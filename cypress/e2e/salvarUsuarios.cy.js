describe('Salvar usuários no arquivo JSON', () => {
    it('Deve buscar os usuários do banco e salvar no arquivo JSON', () => {
        cy.task('queryDb', 'SELECT * FROM usuarios').then((usuarios) => {

            // Verifica se a consulta retornou usuários
            expect(usuarios).to.be.an('array').that.is.not.empty;
            cy.writeFile('cypress/fixtures/usuarios.json', usuarios);

            // Verifica se o arquivo foi salvo corretamente
            cy.readFile('cypress/fixtures/usuarios.json')
                .should('be.an', 'array')
                .and('deep.equal', usuarios);
        });
    });
});
