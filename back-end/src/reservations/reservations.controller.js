const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const Reservation = require("./Reservation.class");
const { getPropsErrorMessage } = require("../common");

/**
 * CRUD
 */
async function list(req, res) {
  res.json({ data: await service.list(req.query.date) });
}

async function create(req, res) {
  res.status(201).json({ data: await service.create(res.locals.reservation) });
}

/**
 * MIDDLEWARE
 */
function hasRequiredProperties(req, res, next) {
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
  const message = getPropsErrorMessage("Missing", reservation.missingProps);
  return next({ status: 400, message });
}

function propsAreValid(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.allPropsAreValid()) {
    return next();
  }
  const message = getPropsErrorMessage("Invalid", reservation.invalidProps);
  return next({ status: 400, message });
}

function dateIsInTheFuture(req, res, next) {
  res.locals.reservationDate = new Date(res.locals.reservation.reservation_date);
  const today = new Date();
  if (today.getTime() > res.locals.reservationDate.getTime()) {
    return next({
      status: 400,
      message: "Please book your reservation for a future date.",
    });
  }
  next();
}

function dateIsNotATuesday(req, res, next) {
  if (res.locals.reservationDate.getUTCDay() === 2) {
    return next({ status: 400, message: "The restaurant is closed on Tuesdays!" });
  }
  next();
}

function timeIsWithinBusinessHours(req, res, next) {
  const reservationDate = res.locals.reservationDate;
  const reservationTime = Number(
    `${reservationDate.getUTCHours()}${reservationDate.getUTCMinutes()}`
  );

  if (reservationTime < 930 || reservationTime > 2130) {
    return next({
      status: 400,
      message: "Please reserve a time within business hours.",
    });
  }
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(propsAreValid),
    asyncErrorBoundary(dateIsInTheFuture),
    asyncErrorBoundary(dateIsNotATuesday),
    asyncErrorBoundary(timeIsWithinBusinessHours),
    asyncErrorBoundary(create),
  ],
};
