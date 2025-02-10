const { faker } = require('@faker-js/faker');
describe('Login', () => {

    it('Deve inserir no campo para login, o nome do usuario criado', () => {

        const nome = faker.person.fullName();
        const email = faker.internet.email();
        const senha = faker.internet.password(10);

        cy.task('queryDb', `INSERT INTO usuarios (nome, email, senha) VALUES ('${nome}', '${email}','${senha}')`)
            .then((result) => {
                expect(result.affectedRows).to.equal(1);
                cy.visit('https://kafka-ui-freeflow-densidade-tarifa-dev.apps.rosa.rosa-ccr.9d8p.p3.openshiftapps.com/auth');
                cy.get('input[name="username"]').type(nome).should('have.value', nome);
            });
    });
});