const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const Table = require("./Table.class");

/**
 * CRUD
 */
async function list(req, res, next) {}
/**
 * MIDDLEWARE
 */

module.exports = {
  list: asyncErrorBoundary(list),
  create: [asyncErrorBoundary(create)],
};
