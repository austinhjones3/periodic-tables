import React, { useState, useContext } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { Link } from "react-router-dom";
import { StatesContext } from "../common/Context";
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
    date,
    tables,
    reservations,
    reservationsError,
    tablesError,
    calledAPI,
    setCalledAPI,
  } = useContext(StatesContext);
  const [error, setError] = useState(null);

  const reservationsMap = reservations.length ? (
    reservations.map(
      (reservation) =>
        reservation.status !== "finished" &&
        reservation.status !== "cancelled" && (
          <ReservationCard
            reservation={reservation}
            calledAPI={calledAPI}
            setCalledAPI={setCalledAPI}
            setError={setError}
          />
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

  const tablesMap = tables.length ? (
    tables.map((table) => (
      <TableCard
        table={table}
        calledAPI={calledAPI}
        setCalledAPI={setCalledAPI}
        setError={setError}
      />
    ))
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
      <ErrorAlert error={error} />
      <h2>Dashboard</h2>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">
              Reservations for {moment(date).format("ddd MMMM Do, YYYY")}
            </h4>
          </div>
          <ErrorAlert error={reservationsError} />
          <DateControl date={date} />
          {reservationsMap}
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="d-md-flex mb-3">
            <h4>Tables</h4>
          </div>
          <ErrorAlert error={tablesError} />
          <div className="mt-3">{tablesMap}</div>
        </div>
      </div>
    </main>
  );
}
