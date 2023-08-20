const creds = {
  development: {
    username: "postgres",
    password: "secret",
    database: "urbancribs",
    host: "localhost",
    dialect: "postgresql",
    logging: false,
    // ssl: false,
    // dialectOptions: {
    //   ssl: {
    //     require: false,
    //     rejectUnauthorized: false,
    //   },
    // },
  },
  test: {
    username: "postgres",
    password: "secret",
    database: "urbancribs",
    host: "localhost",
    dialect: "postgresql",
    logging: false,
    // ssl: false,
    // dialectOptions: {
    //   ssl: {
    //     require: false,
    //     rejectUnauthorized: false,
    //   },
    // },
  },
  production: {
    username: "postgres",
    password: "secret",
    database: "urbancribs",
    host: "localhost",
    dialect: "postgresql",
    logging: false,
    // ssl: false,
    // dialectOptions: {
    //   ssl: {
    //     require: false,
    //     rejectUnauthorized: false,
    //   },
    // },
  },
};

module.exports = creds;
