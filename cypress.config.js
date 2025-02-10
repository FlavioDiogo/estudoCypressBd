module.exports = {
  e2e: {
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
};

const mysql = require('mysql2');

module.exports = {
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        queryDb: (query) => {
          const connection = mysql.createConnection({
            host: 'sql10.freesqldatabase.com',  // Se for um banco online, coloque o host do seu provedor
            user: 'sql10761506',        // Seu usuário do MySQL
            password: 'JRjwSQSfSh',        // Senha (deixe vazio se não tiver)
            database: 'sql10761506' // Nome do banco de dados
          });

          return new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
              if (error) reject(error);
              else resolve(results);
            });
            connection.end();
          });
        }
      });
    },
    "env": {
      "allure": true,
    },
  },
};