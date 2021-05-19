/**
 * Creates a new Table.
 * @class
 * @param {String} table_name
 * @param {Number} capacity
 */
module.exports = class Table {
  constructor(table_name = null, capacity = null) {
    this.table_name = table_name;
    this.capacity = capacity;
  }
  /**
   * @method propNames()
   * @returns {String[]}
   * The list of property names to be used in other methods.
   */
  get propNames() {
    return ["table_name", "capacity"];
  }
};
