/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useContext } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";
import { readReservation, updateTable } from "../../utils/api";
import ErrorAlert from "../../layout/ErrorAlert";
import { StatesContext } from "../../common/Context";

export default function SeatParty() {
  const history = useHistory();
  const { calledAPI, setCalledAPI, tables } = useContext(StatesContext);
  const [res, setRes] = useState({});
  const [filteredTables] = useState(filterTables());
  const [table, setTable] = useState(filteredTables[0]);
  const [error, setError] = useState(null);
  const abortController = new AbortController();
  const {
    params: { reservation_id },
  } = useRouteMatch();

  useEffect(loadReservation, []);
  function loadReservation() {
    readReservation(reservation_id, abortController.signal)
      .then(setRes)
      .catch(setError);
  }

  function filterTables() {
    return tables.filter((table) => !table.reservation_id);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    if (res) {
      if (validateCapacity()) {
        updateTable(table.table_id, reservation_id, abortController.signal)
          .then(() => setCalledAPI(!calledAPI))
          .then(() => history.push("/dashboard"))
          .catch(setError);
      } else {
        setError(() => new Error("party is too large for this table"));
      }
    }
  }

  function handleChange({ target }) {
    setTable(() => tables.find((entry) => +entry.table_id === +target.value));
  }

  function validateCapacity() {
    return res.people <= table.capacity;
  }

  return (
    <div>
      <h2>
        Seat {res.first_name} {res.last_name}'s Party
      </h2>
      <ErrorAlert error={error} />
      <form name="seat-party" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="table_id">Table number:</label>
          <select
            className="ml-2 form-control w-50"
            onChange={handleChange}
            name="table_id"
          >
            {filteredTables.map((table) => (
              <option value={table.table_id} key={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        </div>
        <button className="btn btn-primary" type="submit">
          Submit
        </button>
        <button
          className="btn btn-secondary ml-1"
          onClick={history.goBack}
          type="button"
        >
          Cancel
        </button>
      </form>
    </div>
  );
}
