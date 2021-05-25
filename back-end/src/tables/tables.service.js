const knex = require("../db/connection");
const reservationService = require("../reservations/reservations.service");

async function list() {
  return await knex("tables").orderBy("table_name", "asc");
}

async function create(table) {
  return await knex("tables")
    .insert(table, "*")
    .then((response) => response[0]);
}

async function read(table_id) {
  return await knex("tables").where({ table_id }).first();
}

async function update(table) {
  return await knex("tables")
    .where({ table_id: table.table_id })
    .update(table, "*");
}

async function destroy(table_id) {
  return await knex("tables")
    .where({ table_id })
    .update("reservation_id", null)
    .then(() => reservationsService.updateStatus(reservation_id, "finished"));
}
module.exports = {
  list,
  create,
  read,
  update,
  destroy,
};
