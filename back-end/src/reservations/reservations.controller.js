const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const Reservation = require("./Reservation.class");
/**
 * List handler for reservation resources
 */
async function list(req, res) {
  res.json({
    data: [],
  });
}

async function create(req, res) {
  const data = await service.create(res.locals.reservation);
  res.status(201).json({ data });
}

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

  if (reservation.isValid()) {
    res.locals.reservation = reservation;
    return next();
  } else {
    return next({ status: 400, message: "Missing properties." });
  }
}

module.exports = {
  list,
  create: [asyncErrorBoundary(hasRequiredProperties), asyncErrorBoundary(create)],
};
