import React from "react";
import { Link } from "react-router-dom";

export default function ReservationCard({ reservation }) {
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
        <Link
          className="btn btn-primary"
          to={`/reservations/${reservation.reservation_id}/seat`}
        >
          Seat
        </Link>
      )}
    </div>
  );
}
