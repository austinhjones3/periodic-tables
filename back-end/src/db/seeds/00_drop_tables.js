module.exports.seed = function (knex) {
  // Deletes ALL existing entries
  return await knex("reservations")
    .del()
    .then(() => knex("tables").del());
};
