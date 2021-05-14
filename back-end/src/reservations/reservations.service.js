const knex = require("../db/connection");

function listFilteredByDate(reservation_date) {
  return knex("reservations")
    .where({ reservation_date })
    .orderBy("reservation_time", "asc");
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation, "*")
    .then((response) => response[0]);
}

module.exports = {
  listFilteredByDate,
  create,
};
