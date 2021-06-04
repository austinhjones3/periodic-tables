import React, { useState } from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, Link } from "react-router-dom";
import { previous, today, next } from "../utils/date-time";
import TableCard from "./tables/TableCard";
import ReservationCard from "./reservations/ReservationCard";
import moment from "moment";
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
export default function Dashboard({
  date,
  tables,
  reservations,
  reservationsError,
  tablesError,
  calledAPI,
  setCalledAPI,
}) {
  const history = useHistory();
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

  function formatDate() {
    let dateString = new Date(date).toString().slice(0, 15);
  }

  return (
    <main>
      <nav class="navbar navbar-expand-lg navbar-light bg-link">
        <h1>Welcome to Periodic Tables!</h1>
      </nav>
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
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => history.push(`/dashboard?date=${previous(date)}`)}
          >
            Previous
          </button>
          <button
            type="button"
            className="btn btn-primary ml-1"
            onClick={() => history.push(`/dashboard?date=${today()}`)}
          >
            Today
          </button>
          <button
            type="button"
            className="btn btn-warning ml-1"
            onClick={() => history.push(`/dashboard?date=${next(date)}`)}
          >
            Next
          </button>
          {reservationsMap}
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="d-md-flex mb-3">
            <h4>Tables</h4>
          </div>
          <ErrorAlert error={tablesError} />
          <div className="mt-3">
            {tables ? (
              tables.map((table) => (
                <TableCard
                  table={table}
                  calledAPI={calledAPI}
                  setCalledAPI={setCalledAPI}
                  setError={setError}
                />
              ))
            ) : (
              <h1>No Tables</h1>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
