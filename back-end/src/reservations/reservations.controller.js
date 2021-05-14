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
  res.json({ data: await service.listFilteredByDate(req.query.date) });
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
  } else {
    const missingProp = reservation.getFirstMissingProp();
    return next({ status: 400, message: `Missing property: ${missingProp}` });
  }
}

async function propsAreValid(req, res, next) {
  const reservation = res.locals.reservation;
  const invalidProp = reservation.getInvalidProp();
  if (reservation.allPropsAreValid() && !invalidProp) {
    return next();
  } else {
    return next({ status: 400, message: `Invalid property: ${invalidProp}` });
  }
}

module.exports = {
  list,
  create: [
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(propsAreValid),
    asyncErrorBoundary(create),
  ],
};
