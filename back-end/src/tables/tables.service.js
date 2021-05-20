const knex = require("../db/connection");

async function list() {
  return await knex("tables").orderBy("table_name", "asc");
}

async function create(table) {
  return await knex("tables")
    .insert(table, "*")
    .then((response) => response[0]);
}

module.exports = {
  list,
  create,
};
