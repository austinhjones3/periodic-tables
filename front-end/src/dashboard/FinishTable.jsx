import React, { useState } from "react";
import { deletePartyFromTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function FinishTable({ table, calledAPI, setCalledAPI }) {
  const abortController = new AbortController();
  const [error, setError] = useState();
  function handleDelete() {
    const answer = window.confirm(
      "Is this table ready to seat new guests?\n\nThis cannot be undone."
    );
    if (answer) {
      deletePartyFromTable(table.table_id, abortController.signal)
        .then(setCalledAPI(() => !calledAPI))
        .catch((err) => setError(new Error(err)));
    }
  }
  return (
    <>
      <ErrorAlert error={error} />
      <button
        className="btn btn-danger"
        onClick={handleDelete}
        data-table-id-finish={table.table_id}
      >
        Finish
      </button>
    </>
  );
}
