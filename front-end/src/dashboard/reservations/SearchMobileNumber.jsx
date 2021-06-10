/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { listReservationsForPhoneNumber } from "../../utils/api";
import ReservationCard from "./ReservationCard";
import ErrorAlert from "../../layout/ErrorAlert";
import { Context } from "../../common/Context";

export default function SearchMobileNumber() {
  const [mobileNumber, setMobileNumber] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [findPressed, setFindPressed] = useState(false);
  const {
    Global: { calledAPI },
    Reservations,
  } = useContext(Context);
  const history = useHistory();

  useEffect(search, [calledAPI]);
  function search() {
    if (mobileNumber) {
      listReservationsForPhoneNumber(mobileNumber)
        .then((response) => {
          setFindPressed(true);
          return response;
        })
        .then(setSearchResults)
        .catch(Reservations.setError);
    }
  }

  function handleChange({ target }) {
    setMobileNumber(() => target.value);
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFindPressed(false);
    search();
  }

  return (
    <div>
      <ErrorAlert error={Reservations.error} />
      <form className="mt-2" name="search_for_number" onSubmit={handleSubmit}>
        <label html>
          <h2>Search by Mobile Number</h2>
        </label>
        <div className="row">
          <div className="col-lg-8 col-sm-6 col-xs-8">
            <input
              required
              name="mobile_number"
              type="text"
              value={mobileNumber}
              className="form-control"
              placeholder="Enter a customer's phone number"
              onChange={handleChange}
            />
          </div>
          <div className="col-lg-4 col-sm-6 col-xs-4 mt-1">
            <button type="submit" className="btn btn-primary">
              Find
            </button>
            <button
              type="button"
              className="btn btn-secondary ml-1"
              onClick={() => history.goBack()}
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
      <div className="mt-4">
        {searchResults.length
          ? searchResults.map((reservation) => (
              <ReservationCard reservation={reservation} />
            ))
          : findPressed && <h1>No reservations found</h1>}
      </div>
    </div>
  );
}
