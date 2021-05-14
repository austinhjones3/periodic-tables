const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation, "*")
    .then((response) => response[0]);
}

module.exports = {
  create,
};
