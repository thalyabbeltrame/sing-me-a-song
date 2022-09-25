const { defineConfig } = require('cypress');
const axios = require('axios');

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000';

module.exports = defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      on('task', {
        async resetDB() {
          return axios.delete(`${API_BASE_URL}/e2e/reset-db`).then(() => null);
        },
      });
    },
  },
});
