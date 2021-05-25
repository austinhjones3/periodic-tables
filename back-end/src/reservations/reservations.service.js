const knex = require("../db/connection");

async function list(reservation_date) {
  return await knex("reservations")
    .where({ reservation_date })
    .orderBy("reservation_time", "asc");
}

async function create(reservation) {
  return await knex("reservations")
    .insert(reservation, "*")
    .then((response) => response[0]);
}

async function read(reservation_id) {
  return await knex("reservations").where({ reservation_id }).first();
}

async function updateStatus(reservation_id, newStatus) {
  return await knex("reservations")
    .where({ reservation_id })
    .update("status", newStatus);
}

module.exports = {
  list,
  create,
  read,
  updateStatus,
};
