import React, { useState } from "react";
import { deletePartyFromTable, listTables } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function FinishTable({
  table,
  tables,
  setTables,
  calledAPI,
  setCalledAPI,
}) {
  const [error, setError] = useState(null);

  function handleDelete() {
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
      deletePartyFromTable(table.table_id, abortController.signal)
        .then(() => listTables(abortController.signal))
        .then(setTables)
        .catch(setError);
    }
  }
  return (
    <button
      className="btn btn-danger"
      onClick={handleDelete}
      data-table-id-finish={table.table_id}
    >
      Finish
    </button>
  );
}
