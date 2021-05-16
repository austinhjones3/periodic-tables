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

module.exports = {
  list,
  create,
};
