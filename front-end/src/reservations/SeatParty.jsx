import React, { useState, useEffect } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { readReservation, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function SeatParty({
  date,
  calledAPI,
  setCalledAPI,
  tables,
  setTables,
}) {
  const history = useHistory();
  const [reservation, setReservation] = useState(null);
  const [table, setTable] = useState(tables[0]);
  const [error, setError] = useState(null);
  const abortController = new AbortController();
  const {
    params: { reservationId },
  } = useRouteMatch();

  useEffect(loadReservation, []);
  function loadReservation() {
    return readReservation(reservationId, abortController.signal)
      .then(setReservation)
      .catch(() => setError({ message: "The reservation was not found" }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (reservation && validateCapacity()) {
      updateTable(table.table_id, reservationId, abortController.signal)
        // .then(() => {
        //   const tablesCopy = [...tables];
        //   const tableToUpdate = tablesCopy.findIndex(
        //     (selected) => selected.table_id === table.table_id
        //   );
        //   tablesCopy[tableToUpdate].reservation_id = reservationId;
        //   setTables(tablesCopy);
        // })
        .then(() => setCalledAPI(!calledAPI))
        .then(history.push(`/dashboard?date=${date}`))
        .catch(() => setError({ message: "Update failed." }));
    }
  }

  function handleChange({ target }) {
    setTable(() => tables.find((entry) => +entry.table_id === +target.value));
  }

  function validateCapacity() {
    return reservation.people <= table.capacity;
  }

  return (
    <>
      <h2>Seat Party {reservationId}</h2>
      <ErrorAlert error={error} />
      <form name="seat-party" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_id">Table number:</label>
          <select onChange={handleChange} name="table_id">
            {tables.map((table) => (
              <option value={table.table_id} key={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
        <button className="btn btn-secondary ml-1" onClick={history.getBack}>
          Cancel
        </button>
      </form>
    </>
  );
}
