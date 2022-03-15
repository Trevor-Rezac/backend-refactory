const pool = require('../utils/pool');

module.exports = class Order {
  id;
  product;
  quantity;

  constructor(row) {
    this.id = row.id;
    this.product = row.product;
    this.quantity = row.quantity;
  }

  static async insert({ product, quantity }) {
    // TODO: Implement me
    const { rows } = await pool.query(
      'INSERT INTO orders(product, quantity) VALUES ($1, $2) RETURNING *;',
      [product, quantity]
    );
    const order = new Order(rows[0]);
    return order;
  }

  static async getAll() {
    // TODO: Implement me
    const { rows } = await pool.query('SELECT * FROM orders;');
    const orders = rows.map((row) => new Order(row));
    return orders;
  }

  static async getById(id) {
    // TODO: Implement me
    //get an order from the database
    const { rows } = await pool.query('SELECT * FROM orders WHERE id=$1;', [
      id,
    ]);

    //convert the result into an instance of our Order class
    // return the new instance we created
    if (!rows[0]) return null;
    return new Order(rows[0]);
  }

  static async updateById(id, { product, quantity }) {
    // TODO: Implement me
    const existingOrder = await Order.getById(id);

    if (!existingOrder) return null;

    const newProduct = product ?? existingOrder.product;
    const newQuantity = quantity ?? existingOrder.quantity;

    const { rows } = await pool.query(
      'UPDATE orders SET product=$2, quantity=$3 WHERE id=$1 RETURNING *;',
      [id, newProduct, newQuantity]
    );
    return new Order(rows[0]);
  }

  static async deleteById(id) {
    // TODO: Implement me
    const { rows } = await pool.query(
      'DELETE FROM orders WHERE id=$1 RETURNING *;',
      [id]
    );

    if (!rows[0]) return null;
    const order = new Order(rows[0]);
    return order;
  }
};
