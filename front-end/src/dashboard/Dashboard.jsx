import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, Link } from "react-router-dom";
import { previous, today, next } from "../utils/date-time";
import TableCard from "./TableCard";
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
  setReservations,
  reservationsError,
  setReservationsError,
  setTables,
  tablesError,
  calledAPI,
  setCalledAPI,
}) {
  const history = useHistory();

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="row">
        <div className="col-md-6 col-sm-12">
          <div className="d-md-flex mb-3">
            <h4 className="mb-0">Reservations for date {date}</h4>
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
            className="btn btn-secondary ml-1"
            onClick={() => history.push(`/dashboard?date=${today()}`)}
          >
            Today
          </button>
          <button
            type="button"
            className="btn btn-secondary ml-1"
            onClick={() => history.push(`/dashboard?date=${next(date)}`)}
          >
            Next
          </button>
          {reservations.map((entry) => (
            <div className="card mt-1">
              <div className="card-body">
                <h5 className="card-title">
                  Reservation for: {`${entry.first_name} ${entry.last_name}`}
                </h5>
                <p className="card-text">Number: {entry.mobile_number}</p>
                <p className="card-text">Date: {entry.reservation_date}</p>
                <p className="card-text">Time: {entry.reservation_time}</p>
                <p className="card-text">Party Size: {entry.people}</p>
              </div>
              <Link
                className="btn btn-primary"
                to={`/reservations/${entry.reservation_id}/seat`}
              >
                Seat
              </Link>
            </div>
          ))}
        </div>
        <div className="col-md-6 col-sm-12">
          <div className="d-md-flex mb-3">
            <h4>Tables</h4>
          </div>
          <ErrorAlert error={tablesError} />
          {tables ? (
            tables.map((table) => (
              <TableCard
                table={table}
                calledAPI={calledAPI}
                setCalledAPI={setCalledAPI}
                tables={tables}
                setTables={setTables}
              />
            ))
          ) : (
            <h1>No Tables</h1>
          )}
        </div>
      </div>
    </main>
  );
}
