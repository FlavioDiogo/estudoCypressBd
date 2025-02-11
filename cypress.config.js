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
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
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