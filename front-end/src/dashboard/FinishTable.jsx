import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { deletePartyFromTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function FinishTable({
  date,
  tables,
  setTables,
  table,
  calledAPI,
  setCalledAPI,
}) {
  const [error, setError] = useState(null);
  const history = useHistory();

  function handleDelete() {
    const abortController = new AbortController();
    const answer = window.confirm(
      "Is this table ready to seat new guests? \n\nThis cannot be undone."
    );
    if (answer) {
      deletePartyFromTable(table.table_id, abortController.signal)
        .then(() => {
          const tablesCopy = [...tables];
          const tableToUpdate = tablesCopy.findIndex(
            (entry) => entry.table_id === table.table_id
          );
          tablesCopy[tableToUpdate].reservation_id = null;
          return tablesCopy;
        })
        .then(setTables)
        // .then(() => setCalledAPI(!calledAPI))
        .catch(setError);
    }
  }
  return (
    <button
      className="btn btn-danger"
      onClick={handleDelete}
      data-table-id-finish={`${table.table_id}`}
    >
      Finish
    </button>
  );
}
