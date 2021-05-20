const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const Table = require("./Table.class");
const { getPropsErrorMessage } = require("../common");

/**
 * CRUD
 */
async function list(req, res, next) {
  res.json({ data: await service.list() });
}

async function create(req, res, next) {
  res.status(201).json({ data: await service.create(res.locals.table) });
}

/**
 * MIDDLEWARE
 */
function hasRequiredProperties(req, res, next) {
  const { data } = req.body;
  if (!data) return next({ status: 400, message: "No data to create." });
  const table = new Table(data.table_name, data.capacity);

  if (table.hasAllProps()) {
    res.locals.table = table;
    return next();
  }
  const message = getPropsErrorMessage("Missing", table.missingProps);
  return next({ status: 400, message });
}

function tableNameIsLongEnough(req, res, next) {
  if (res.locals.table.table_name.length > 1) next();
  else next({ status: 400, message: "table_name is too short" });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(tableNameIsLongEnough),
    asyncErrorBoundary(create),
  ],
};
