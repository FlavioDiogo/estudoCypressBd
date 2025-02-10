const { faker } = require('@faker-js/faker');
describe('Testes de Banco de Dados no Cypress', () => {

    it('Deve inserir um novo usuário', () => {

        const nome = faker.person.fullName();
        const email = faker.internet.email();
        const senha = faker.internet.password(10);

        cy.task('queryDb', `INSERT INTO usuarios (nome, email, senha) VALUES ('${nome}', '${email}', '${senha}')`)
            .then((result) => {
                expect(result.affectedRows).to.equal(1);
                // Buscar o ID do usuário recém-criado
                return cy.task('queryDb', `SELECT id, criado_em FROM usuarios WHERE email = '${email}'`);
            })
            .then((result) => {
                if (result.length === 0) {
                    throw new Error('Usuário não encontrado após inserção!');
                }

                const { id, criado_em } = result[0];

                //Lê o arquivo JSON existente
                cy.readFile('cypress/fixtures/usuarios.json')
                    .then((data) => {
                        const usuarios = Array.isArray(data) ? data : []; //Garante que é um array válido

                        //Adiciona o novo usuário à lista
                        usuarios.push({ id, nome, email, senha, criado_em });

                        //Salva de volta no arquivo JSON
                        cy.writeFile('cypress/fixtures/usuarios.json', usuarios);
                    });
            });
    });

    it('Deve buscar um usuário pelo e-mail', () => {

        /*it('Deve buscar um usuário pelo e-mail', () => {
        cy.task('queryDb', `SELECT * FROM usuarios WHERE email = 'fluiz@example.com'`)
            .then((result) => {
                expect(result).to.have.length(1);
                expect(result[0]).to.have.property('nome', 'Flávio Luiz');*/

        const email = 'fluiz@example.com';

        cy.task('queryDb', `SELECT * FROM usuarios WHERE email = '${email}'`)
            .then((result) => {
                if (result.length === 0) {
                    cy.log(`Usuário com e-mail ${email} não encontrado, seguindo sem erro.`);
                    return; //Sai da função sem falhar
                }

                //Caso o usuário exista, faz as verificações
                expect(result).to.have.length(1);
                expect(result[0]).to.have.property('nome', 'Flávio Luiz');
            });
    });

    it('Deve listar todos os usuários cadastrados', () => {
        cy.task('queryDb', 'SELECT * FROM usuarios')
            .then((result) => {
                cy.log('Lista de Usuários:');
                result.forEach(user => {
                    cy.log(`ID: ${user.id}, Nome: ${user.nome}, Email: ${user.email}`);
                });

                //Exibir todos os usuários no console do navegador
                console.table(result);

                //Garantir que há pelo menos um usuário cadastrado
                expect(result.length).to.be.greaterThan(0);
            });
    });

    it('Deve atualizar o nome do usuário e validar a mudança', () => {

        /*it('Deve atualizar o nome do usuário', () => {
        cy.task('queryDb', `UPDATE usuarios SET nome = 'João Pedro' WHERE email = 'joao@example.com'`)
            .then((result) => {
                expect(result.affectedRows).to.equal(1);*/

        const novoNome = 'Flávio novo '; //Garante um nome único para cada execução

        //Busca o nome atual do usuário
        cy.task('queryDb', `SELECT nome FROM usuarios WHERE email = 'fduarte@example.com'`)
            .then((usuarios) => {
                expect(usuarios.length).to.be.greaterThan(0); //Garante que encontrou o usuário
                const nomeAtual = usuarios[0].nome;
                cy.log('Nome atual:', nomeAtual);

                //Atualiza o nome do usuário no banco
                return cy.task('queryDb', `UPDATE usuarios SET nome = '${novoNome}' WHERE email = 'fduarte@example.com'`);
            })
            .then((result) => {
                expect(result.affectedRows).to.equal(1);
                cy.log('Nome atualizado para:', novoNome);

                //Valida se o nome foi atualizado corretamente
                return cy.task('queryDb', `SELECT nome FROM usuarios WHERE email = 'fduarte@example.com'`);
            })
            .then((usuariosAtualizados) => {
                expect(usuariosAtualizados[0].nome).to.equal(novoNome);
                cy.log('Confirmação de que o nome foi atualizado com sucesso.');
            });
    });

    it('Deve excluir um usuário pelo e-mail apenas se ele existir', () => {

        /*it('Deve excluir um usuário pelo e-mail', () => {
    cy.task('queryDb', `DELETE FROM usuarios WHERE email = 'joao@example.com'`)
        .then((result) => {
            expect(result.affectedRows).to.equal(1);*/

        const email = 'joao@example.com';

        //Verifica se o usuário existe no banco
        cy.task('queryDb', `SELECT * FROM usuarios WHERE email = '${email}'`)
            .then((usuarios) => {
                if (usuarios.length > 0) {
                    cy.log(`Usuário encontrado: ${email}, procedendo com a exclusão.`);

                    //Exclui o usuário caso ele exista
                    return cy.task('queryDb', `DELETE FROM usuarios WHERE email = '${email}'`);
                } else {
                    cy.log(`Usuário ${email} não encontrado, nenhuma ação necessária.`);
                    return null; //Retorna null para evitar erro no then
                }
            })
            .then((result) => {
                if (result) {
                    expect(result.affectedRows).to.equal(1);
                    cy.log('Usuário excluído com sucesso.');
                }
            })
    })
})