import React, { useState, useEffect } from "react";
import NewReservation from "../reservations/NewReservation";
import NewTable from "../tables/NewTable";
import SeatParty from "../reservations/SeatParty";
import { listTables } from "../utils/api";
import { Redirect, Route, Switch } from "react-router-dom";
import Dashboard from "../dashboard/Dashboard";
import NotFound from "./NotFound";
import { today } from "../utils/date-time";
import useQuery from "../utils/useQuery";

/**
 * Defines all the routes for the application.
 *
 * You will need to make changes to this file.
 *
 * @returns {JSX.Element}
 */
export default function Routes() {
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const [calledAPI, setCalledAPI] = useState(false);

  const query = useQuery();
  const date = query.get("date");

  useEffect(loadTables, [calledAPI]);
  function loadTables() {
    const abortController = new AbortController();
    listTables(abortController.signal).then(setTables).catch(setTablesError);
  }
  return (
    <Switch>
      <Route exact path="/">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route exact path="/tables/new">
        <NewTable setCalledAPI={setCalledAPI} />
      </Route>
      <Route exact path="/reservations/:reservationId/seat">
        <SeatParty
          calledAPI={calledAPI}
          setCalledAPI={setCalledAPI}
          tables={tables}
          setTables={setTables}
        />
      </Route>
      <Route exact path="/reservations/new">
        <NewReservation />
      </Route>
      <Route exact path="/reservations">
        <Redirect to={"/dashboard"} />
      </Route>
      <Route path="/dashboard">
        <Dashboard
          date={date ? date : today()}
          tables={tables}
          setTables={setTables}
          tablesError={tablesError}
          calledAPI={calledAPI}
          setCalledAPI={setCalledAPI}
        />
      </Route>
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}
