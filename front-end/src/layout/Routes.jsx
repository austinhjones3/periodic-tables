import React, { useState, useEffect } from "react";
import AddEditReservation from "../dashboard/reservations/AddEditReservation";
import NewTable from "../dashboard/tables/NewTable";
import SeatParty from "../dashboard/reservations/SeatParty";
import SearchMobileNumber from "../dashboard/reservations/SearchMobileNumber";
import { listTables, listReservations } from "../utils/api";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";
import { StatesContext } from "../common/Context";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
export default function Routes() {
  const [tables, setTables] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tablesError, setTablesError] = useState(null);
  const [calledAPI, setCalledAPI] = useState(false);

  const query = useQuery();
  const dateQuery = query.get("date");
  const date = dateQuery ? dateQuery : today();

  const states = {
    date,
    tables,
    setTables,
    reservations,
    setReservations,
    reservationsError,
    setReservationsError,
    tablesError,
    setTablesError,
    calledAPI,
    setCalledAPI,
  };

  useEffect(loadReservations, [calledAPI, date]);
  function loadReservations() {
    const abortController = new AbortController();
    listReservations({ date }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
  }

  useEffect(loadTables, [calledAPI]);
  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setTablesError);
  }

  return (
    <Switch>
      <StatesContext.Provider value={states}>
        <Route exact path="/">
          <Redirect to={"/dashboard"} />
        </Route>
        <Route exact path="/reservations">
          <Redirect to={"/dashboard"} />
        </Route>
        <Route exact path="/tables/new" component={NewTable} />
        <Route
          exact
          path="/reservations/:reservation_id/edit"
          component={AddEditReservation}
        />
        <Route
          exact
          path="/reservations/:reservation_id/seat"
          component={SeatParty}
        />
        <Route exact path="/reservations/new" component={AddEditReservation} />
        <Route exact path="/search" component={SearchMobileNumber} />
        <Route exact path="/dashboard" component={Dashboard} />
      </StatesContext.Provider>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
