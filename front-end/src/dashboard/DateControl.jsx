import React from "react";
import { useHistory } from "react-router-dom";
import { next, previous, today } from "../utils/date-time";
export default function DateControl({ date }) {
  const history = useHistory();
  return (
    <div className="row">
      <div className="col-md-12 col-lg-6">
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
      </div>

      <div className="form-group col-md-12 col-lg-6">
        <input
          required
          type="date"
          name="reservation_date"
          value={date}
          className="form-control"
          onChange={({ target: { value } }) =>
            history.push(`/dashboard?date=${value}`)
          }
        />
      </div>
    </div>
  );
}
