module.exports = class Reservation {
  constructor(
    first_name = null,
    last_name = null,
    mobile_number = null,
    reservation_date = null,
    reservation_time = null,
    people = null
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.mobile_number = mobile_number;
    this.reservation_date = reservation_date;
    this.reservation_time = reservation_time;
    this.people = people;
  }

  isValid() {
    return (
      this.first_name &&
      this.last_name &&
      this.mobile_number &&
      this.reservation_date &&
      this.reservation_time &&
      this.people
    );
  }
};
