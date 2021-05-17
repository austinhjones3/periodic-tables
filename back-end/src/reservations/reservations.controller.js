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
  const message = _getPropsErrorMessage("Missing", reservation.missingProps);
  return next({ status: 400, message });
}

function propsAreValid(req, res, next) {
  const reservation = res.locals.reservation;
  if (reservation.allPropsAreValid()) {
    return next();
  }
  const message = _getPropsErrorMessage("Invalid", reservation.invalidProps);
  return next({ status: 400, message });
}

function _getPropsErrorMessage(missingOrInvalid, props) {
  let message = `${missingOrInvalid} properties: `;
  const len = props.length;
  for (let i = 0; i < len; i++) {
    const prop = props[i];
    message += prop;
    if (i < len - 1) {
      message += ", ";
    } else {
      message += ".";
    }
  }
  return message;
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    asyncErrorBoundary(hasRequiredProperties),
    asyncErrorBoundary(propsAreValid),
    asyncErrorBoundary(create),
  ],
};
