import React from "react";
import { Link } from "react-router-dom";
import { updateReservationStatus } from "../../utils/api";

export default function ReservationCard({
  reservation,
  calledAPI,
  setCalledAPI,
}) {
  function handleCancel() {
    const abortController = new AbortController();
    const answer = window.confirm(
      "Do you want to cancel this reservation?\n\nThis cannot be undone."
    );
    if (answer) {
      updateReservationStatus(
        Number(reservation.reservation_id),
        "cancelled",
        abortController.signal
      )
        .then(() => setCalledAPI(!calledAPI))
        .catch(console.log);
    }
  }

  return (
    <div className="card mt-1">
      <div className="card-body">
        <h5 className="card-title">
          Reservation for:{" "}
          {`${reservation.first_name} ${reservation.last_name}`}
        </h5>
        <p className="card-text">Number: {reservation.mobile_number}</p>
        <p className="card-text">Date: {reservation.reservation_date}</p>
        <p className="card-text">Time: {reservation.reservation_time}</p>
        <p className="card-text">Party Size: {reservation.people}</p>
        <p
          data-reservation-id-status={reservation.reservation_id}
          className="card-text"
        >
          Status: {reservation.status}
        </p>
      </div>
      {reservation.status === "booked" && (
        <div>
          <Link
            className="btn btn-primary w-25 mb-1 ml-1"
            to={`/reservations/${reservation.reservation_id}/seat`}
          >
            Seat
          </Link>
          <Link
            className="btn btn-secondary w-25 mb-1 ml-1"
            to={`/reservations/${reservation.reservation_id}/edit`}
          >
            Edit
          </Link>
          <button
            type="button"
            data-reservation-id-cancel={reservation.reservation_id}
            onClick={handleCancel}
            className="btn btn-danger w-25 mb-1 ml-1"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  );
}
