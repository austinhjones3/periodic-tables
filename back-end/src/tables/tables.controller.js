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

async function update(req, res, next) {
  res.json();
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

/**
 * tables/:table_id/seat
 */
async function reservationIdExists(req, res, next) {
  const { data } = req.body;
  if (!data) {
    return next({ status: 400, message: "Request data is missing." });
  }
  const id = data.reservation_id;

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

async function tableHasReservationCapacity(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);
  if (!table) {
    return next({ status: 404, message: `table_id: ${table_id} does not exist` });
  }
  const reservation = res.locals.reservation;
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(tableNameIsLongEnough),
    asyncErrorBoundary(create),
  ],
  update: [
    asyncErrorBoundary(reservationIdExists),
    asyncErrorBoundary(tableHasReservationCapacity),
    asyncErrorBoundary(update),
  ],
};
