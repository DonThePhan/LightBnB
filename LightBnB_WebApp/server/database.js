const properties = require('./json/properties.json');
const users = require('./json/users.json');
const { Pool } = require('pg');

const pool = new Pool({
  user: 'vagrant',
  password: '123',
  host: 'localhost',
  database: 'light_bnb_db'
});

/// Users

/**
 * Get a single user from the database given their email.
 * @param {String} email The email of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithEmail = function(email) {
  return pool
    .query(`SELECT * FROM users WHERE email = $1;`, [ email ])
    .then((user) => {
      if (user.rows) {
        return user.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => console.log(err.message));
};
exports.getUserWithEmail = getUserWithEmail;

/**
 * Get a single user from the database given their id.
 * @param {string} id The id of the user.
 * @return {Promise<{}>} A promise to the user.
 */
const getUserWithId = function(id) {
  return pool
    .query(`SELECT * FROM users WHERE $1 = users.id;`, [ id ])
    .then((user) => {
      if (user.rows) {
        return user.rows[0];
      } else {
        return null;
      }
    })
    .catch((err) => console.log(err.message));
};
exports.getUserWithId = getUserWithId;

/**
 * Add a new user to the database.
 * @param {{name: string, password: string, email: string}} user
 * @return {Promise<{}>} A promise to the user.
 */
const addUser = function(user) {
  return pool
    .query(
      `
      INSERT INTO users (name, email, password)
      VALUES ($1, $2, 'password')
      RETURNING *;`,
      [ user.name, user.email ]
    )
    .then((user) => {
      if (user && user.rows) {
        return users.rows;
      } else {
        return null;
      }
    })
    .catch((err) => console.log(err.message, 'error'));
};
exports.addUser = addUser;

/// Reservations

/**
 * Get all reservations for a single user.
 * @param {string} guest_id The id of the user.
 * @return {Promise<[{}]>} A promise to the reservations.
 */
const getAllReservations = function(guest_id, limit = 10) {
  return pool
    .query(`SELECT * FROM reservations WHERE guest_id = $1 AND end_date > Now() LIMIT $2;`, [ guest_id, limit ])
    .then((reservations) => {
      if (reservations && reservations.rows) {
        // console.log(reservations.rows);
        return reservations.rows;
      } else {
        return null;
      }
    })
    .catch((err) => console.log(err.message));
};
exports.getAllReservations = getAllReservations;

/// Properties

/**
 * Get all properties.
 * @param {{}} options An object containing query options.
 * @param {*} limit The number of results to return.
 * @return {Promise<[{}]>}  A promise to the properties.
 */
const getAllProperties = function(options, limit = 10) {
  // 1
  const queryParams = [];
  // 2
  let queryString = `
  SELECT properties.*, avg(property_reviews.rating) as average_rating
  FROM properties
  JOIN property_reviews ON properties.id = property_id
  WHERE 1 = 1
  `;

  // 3
  if (options.city) {
    queryParams.push(`%${options.city}%`);
    queryString += `AND city LIKE $${queryParams.length} `;
  }

  if (options.owner_id) {
    queryParams.push(options.owner_id);
    queryString += `AND properties.owner_id = $${queryParams.length} `;
  }

  if (options.minimum_price_per_night) {
    queryParams.push(options.minimum_price_per_night * 100);
    queryString += `AND properties.cost_per_night >= $${queryParams.length} `;
  }

  if (options.maximum_price_per_night) {
    queryParams.push(options.maximum_price_per_night * 100);
    queryString += `AND properties.cost_per_night <= $${queryParams.length} `;
  }

  // 4
  queryString += `
  GROUP BY properties.id
  `;

  if (options.minimum_rating) {
    queryParams.push(options.minimum_rating);
    queryString += `
    HAVING avg(property_reviews.rating) >= $${queryParams.length}
    `;
  }

  queryParams.push(limit);
  queryString += `
  ORDER BY cost_per_night
  LIMIT $${queryParams.length};
  `;

  // 5
  console.log(options, queryString, queryParams);

  // 6
  return pool.query(queryString, queryParams).then((res) => res.rows);
};

exports.getAllProperties = getAllProperties;

/**
 * Add a property to the database
 * @param {{}} property An object containing all of the property details.
 * @return {Promise<{}>} A promise to the property.
 */
const addProperty = function(property) {
  const queryParams = [];
  const propertyNames = [
    'owner_id',
    'title',
    'description',
    'thumbnail_photo_url',
    'cover_photo_url',
    'cost_per_night',
    'street',
    'city',
    'province',
    'post_code',
    'country',
    'parking_spaces',
    `number_of_bathrooms`,
    `number_of_bedrooms`,
    `active`
  ];
  let queryString = `INSERT INTO properties (`;
  for (propertyName of propertyNames) {
    queryString += `${propertyName},`;
  }
  queryString = queryString.slice(0, -1);
  queryString += `)
  VALUES (`;

  for (propertyName of propertyNames) {
    if (propertyName === 'active') {
      /** Active case */
      queryParams.push(0);
    } else {
      queryParams.push(property[propertyName]);
    }
    queryString += `$${queryParams.length},`;
  }

  queryString = queryString.slice(0, -1);
  queryString += `)
  RETURNING *;`;

  console.log(queryParams, queryString);
  return pool.query(queryString, queryParams).then((res) => res.rows);
};
exports.addProperty = addProperty;
