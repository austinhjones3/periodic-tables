import React, { useEffect, useState } from "react";
import {
  listReservations,
  deletePartyFromTable,
  listTables,
} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { useHistory, Link } from "react-router-dom";
import { previous, today, next } from "../utils/date-time";
import FinishTable from "./FinishTable";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
export default function Dashboard({
  date,
  tables,
  setTables,
  tablesError,
  calledAPI,
  setCalledAPI,
}) {
  const history = useHistory();
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);

  useEffect(loadDashboard, [date]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }

  function handleDelete({ target }) {
    const abortController = new AbortController();
    const answer = window.confirm(
      "Is this table ready to seat new guests? \n\nThis cannot be undone."
    );
    if (answer) {
      // deletePartyFromTable(table.table_id, abortController.signal)
      //   .then(() => {
      //     const tablesCopy = [...tables];
      //     const tableToUpdate = tablesCopy.findIndex(
      //       (selected) => selected.table_id === table.table_id
      //     );
      //     tablesCopy[tableToUpdate].reservation_id = null;
      //     setTables(tablesCopy);
      //   })
      //   .catch(setError);
      deletePartyFromTable(target.key, abortController.signal)
        .then(() => listTables(abortController.signal))
        .then(setTables)
        .catch(console.log);
    }
  }

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
          {tables.map((table) => (
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Table: {table.table_name}</h5>
                <p className="card-text">Capacity: {table.capacity}</p>
                <p data-table-id-status={table.table_id}>
                  Occupied
                  {/* {table.reservation_id ? "Occupied" : "Free"} */}
                </p>
                {table.reservation_id ? (
                  <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    data-table-id-finish={table.table_id}
                    key={table.table_id}
                  >
                    Finish
                  </button>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
