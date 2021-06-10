import React, { useContext } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { Link } from "react-router-dom";
import { Context } from "../common/Context";
import TableCard from "./tables/TableCard";
import ReservationCard from "./reservations/ReservationCard";
import moment from "moment";
import DateControl from "./DateControl";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
export default function Dashboard() {
  const {
    Global: { date },
    Tables,
    Reservations,
  } = useContext(Context);
  const reservationsMap = Reservations.list.length ? (
    Reservations.list.map(
      (reservation) =>
        reservation.status !== "finished" &&
        reservation.status !== "cancelled" && (
          <ReservationCard reservation={reservation} />
        )
    )
  ) : (
    <div className="mt-3">
      <Link className=" btn btn-success nav-link" to="/reservations/new">
        <span className="oi oi-plus" />
        &nbsp;New Reservation
      </Link>
      <h2 className="mt-3">
        No reservations for this day yet! Click to make one.
      </h2>
    </div>
  );

  const tablesMap = Tables.list.length ? (
    Tables.list.map((table) => <TableCard table={table} />)
  ) : (
    <div className="mt-3">
      <Link className=" btn btn-success nav-link" to="/tables/new">
        <span className="oi oi-plus" />
        &nbsp;New Table
      </Link>
      <h2 className="mt-3">No tables in the system! Click to make one.</h2>
    </div>
  );

  return (
    <main>
      <h2>Dashboard</h2>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">
              Reservations for {moment(date).format("ddd MMMM Do, YYYY")}
            </h4>
          </div>
          <ErrorAlert error={Reservations.error} />
          <DateControl date={date} />
          {reservationsMap}
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="d-md-flex mb-3">
            <h4>Tables</h4>
          </div>
          <ErrorAlert error={Tables.error} />
          <div className="mt-3">{tablesMap}</div>
        </div>
      </div>
    </main>
  );
}
