const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const Reservation = require("./Reservation.class");
/**
 * List handler for reservation resources
 */
/**
 * CRUD
 */
async function list(req, res) {
  res.json({ data: await service.list(req.query.date) });
}

async function create(req, res) {
  const data = await service.create(res.locals.reservation);
  res.status(201).json({ data });
}

/**
 * MIDDLEWARE
 */
async function hasRequiredProperties(req, res, next) {
  const { data } = req.body;
  if (!data) return next({ status: 400, message: "No data to create." });
  const reservation = new Reservation(
    data.first_name,
    data.last_name,
    data.mobile_number,
    data.reservation_date,
    data.reservation_time,
    data.people
  );
  if (reservation.hasAllProps()) {
    res.locals.reservation = reservation;
    return next();
  }
  const missingProps = reservation.getMissingProps();
  let message = "Missing properties: ";
  const length = missingProps.length;
  for (let i = 0; i < length; i++) {
    const prop = missingProps[i];
    message += prop;
    if (i < length - 1) {
      message += ", ";
    } else {
      message += ".";
    }
  }
  return next({ status: 400, message });
}

async function propsAreValid(req, res, next) {
  const reservation = res.locals.reservation;
  const invalidProps = reservation.getInvalidProps();
  if (reservation.allPropsAreValid() && invalidProps.length === 0) {
    return next();
  }
  let message = "Invalid properties: ";
  const length = invalidProps.length;
  for (let i = 0; i < length; i++) {
    const prop = invalidProps[i];
    message += prop;
    if (i < length - 1) {
      message += ", ";
    } else {
      message += ".";
    }
  }
  return next({ status: 400, message });
}

module.exports = {
  list,
  create: [
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(propsAreValid),
    asyncErrorBoundary(create),
  ],
};
