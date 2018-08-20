"use strict";

const Knex = require("knex");

const DB = require("../db/DB");
const knexConfig = require("../db/knexfile");
const {seed} = require("../db/seeds/test_subscribers");


// (Re-)create DB connection at the beginning of each test suite
beforeAll(() => {
  DB.createConnection();
});


// Reset the subscribers records before each test
beforeEach(async () => {
  const knex = Knex(knexConfig);
  await knex("subscribers").truncate();
  await seed(knex);
  knex.destroy();
});


// Destroy DB connection at the end of each test suite
// Without this, some test failures leave the handle open
// causing the test runner to hang.
afterAll(() => {
  DB.destroyConnection();
});
