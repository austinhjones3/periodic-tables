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

  get propNames() {
    return [
      "first_name",
      "last_name",
      "mobile_number",
      "reservation_date",
      "reservation_time",
      "people",
    ];
  }

  hasAllProps() {
    return (
      this.first_name &&
      this.last_name &&
      this.mobile_number &&
      this.reservation_date &&
      this.reservation_time &&
      this.people
    );
  }

  /**
   * time: 00:00:00
   * date: YYYY-MM-DD
   * phone: 000-000-0000
   */

  allPropsAreValid() {
    const regExForProps = this.regExForProps;
    return (
      regExForProps.mobile_number.test(this.mobile_number) &&
      regExForProps.reservation_time.test(this.reservation_time) &&
      regExForProps.reservation_date.test(this.reservation_date) &&
      regExForProps.people.test(this.people) &&
      typeof this.people === "number"
    );
  }

  get regExForProps() {
    return {
      first_name: /.*/,
      last_name: /.*/,
      mobile_number: /(\d{3}[-])?\d{3}[-]\d{4}/,
      reservation_time: /([2][0-3])|([0-1][0-9])[:][0-5][0-9]/,
      reservation_date: /\d{4}[-]\d{2}[-]\d{2}/,
      people: /\d{1,3}/,
    };
  }

  get invalidProps() {
    const regExForProps = this.regExForProps;
    const propNames = this.propNames;
    const result = [];

    if (typeof this.people != "number") {
      result.push("people");
    }

    for (let prop of propNames) {
      if (!regExForProps[prop].test(this[prop])) {
        result.push(prop);
      }
    }

    return result;
  }

  get missingProps() {
    const propNames = this.propNames;
    const result = [];
    for (let prop of propNames) {
      if (!this[prop]) {
        result.push(prop);
      }
    }
    return result;
  }
};
