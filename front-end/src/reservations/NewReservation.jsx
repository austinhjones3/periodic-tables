import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import { createReservation } from "../utils/api";

export default function NewReservation({ reservations, setReservations }) {
  const history = useHistory();
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  });

  // changes state actively as data is input by user
  function handleChange({ target }) {
    return setFormData(() => ({ ...formData, [target.name]: target.value }));
  }

  function handleSubmit(event) {
    event.preventDefault();
    createReservation(formData)
      .then(() => history.push(`/dashboard?date=${formData.reservation_date}`))
      .catch(console.log("Deez nuts"));
    history.push(`/dashboard?date=${formData.reservation_date}`);
  }

  return (
    <>
      <h2>Reserve A Table</h2>
      <form name="create_reservation" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="first_name">First Name</label>
          <input
            required
            type="text"
            name="first_name"
            value={formData.first_name}
            className="form-control"
            placeholder="Jane"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="last_name">Last Name</label>
          <input
            required
            type="text"
            name="last_name"
            value={formData.last_name}
            className="form-control"
            placeholder="Appleseed"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="mobile_number">Mobile Number</label>
          <input
            required
            type="tel"
            name="mobile_number"
            value={formData.mobile_number}
            className="form-control"
            placeholder="123-456-7890"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_date">Date</label>
          <input
            required
            type="date"
            name="reservation_date"
            value={formData.reservation_date}
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="reservation_time">Time</label>
          <input
            required
            type="time"
            name="reservation_time"
            value={formData.reservation_time}
            className="form-control"
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="people">Number of People</label>
          <input
            required
            type="number"
            name="people"
            value={formData.people}
            className="form-control"
            placeholder="#"
            onChange={handleChange}
          />
        </div>
        <button type="submit">Submit</button>
        <button onClick={history.goBack} className="ml-1" type="button">
          Cancel
        </button>
      </form>
    </>
  );
}
