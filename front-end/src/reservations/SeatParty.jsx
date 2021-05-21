import React, { useState } from "react";
import { useRouteMatch, useHistory } from "react-router-dom";

export default function SeatParty() {
  const {
    params: { reservation_id: id },
  } = useRouteMatch();

  return (
    <>
      <div></div>
    </>
  );
}
