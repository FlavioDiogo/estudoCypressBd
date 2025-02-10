const allureWriter = require('@shelex/cypress-allure-plugin/writer');

module.exports = (on, config) => {
  allureWriter(on, config);

  // Retorne a configuração do Cypress após a modificação
  return config;
};
