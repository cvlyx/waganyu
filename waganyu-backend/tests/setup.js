const request = require('supertest');
const app = require('../server');

global.request = request(app);
