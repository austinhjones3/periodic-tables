const service = require("./tables.service");
const reservationService = require("../reservations/reservations.service");
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

async function read(req, res, next) {
  res.json({ data: res.locals.table });
}

async function update(req, res, next) {
  res.json({ data: await service.update(res.locals.table) });
}

/**
 * MIDDLEWARE for /tables and /tables/:table_id
 */
async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (table) {
    res.locals.table = table;
    return next();
  } else {
    return next({ status: 404, message: `table_id: ${table_id} does not exist` });
  }
}

function hasAllTableProperties(req, res, next) {
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

/**
 * MIDDLEWARE for tables/:table_id/seat
 */
async function reservationIdExists(req, res, next) {
  const { data } = req.body;
  if (!data) {
    return next({ status: 400, message: "Request data is missing." });
  }
  const id = data.reservation_id;
  res.locals.reservation_id = id;
  if (!id) {
    return next({
      status: 400,
      message: `No reservation_id requested`,
    });
  }
  const reservation = await reservationService.read(id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({
      status: 404,
      message: `The reservation_id: ${id} does not exist.`,
    });
  }
}

async function tableIsAvailable(req, res, next) {
  const table = res.locals.table;
  if (!table) {
    return next({ status: 404, message: `table_id: ${table_id} does not exist` });
  }
  const reservation = res.locals.reservation;
  if (table.reservation_id) {
    return next({
      status: 400,
      message: "Table is currently occupied/unavailable.",
    });
  }
  if (reservation.people > table.capacity) {
    return next({
      status: 400,
      message: "Reservation party size is too large for table capacity.",
    });
  }
  table.reservation_id = res.locals.reservation_id;
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(hasAllTableProperties),
    asyncErrorBoundary(tableNameIsLongEnough),
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(tableExists), asyncErrorBoundary(read)],
  update: [
    asyncErrorBoundary(reservationIdExists),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(tableIsAvailable),
    asyncErrorBoundary(update),
  ],
};
