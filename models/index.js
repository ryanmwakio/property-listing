"use strict";

const fs = require("fs");
const path = require("path");
const Sequelize = require("sequelize");
const basename = path.basename(__filename);
const db = {};

let sequelize;
let config;

// check if the environment is production or development
// if (process.env.NODE_ENV === "production") {
//   config = {
//     logging: false,
//     omitNull: true,
//     // ssl: true,
//     // dialectOptions: {
//     //   ssl: {
//     //     require: true,
//     //     rejectUnauthorized: false,
//     //   },
//     // },
//   };
// } else {
//   config = {
//     logging: false,
//     omitNull: true,
//   };
// }

config = {
  logging: false,
  omitNull: true,
  username: "postgres",
  password: "secret",
  database: "urbancribs",
  host: "localhost",
  dialect: "postgresql",
  logging: false,
};

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize(
    "postgres://urbancribsdbinstance_user:EN0hip4tKQLqIoj2FMMQ5V1GN9e2kQGU@dpg-cjh827r37aks739hc21g-a/urbancribsdbinstance",
    config
  );
} else {
  sequelize = new Sequelize(
    "postgres://urbancribsdbinstance_user:EN0hip4tKQLqIoj2FMMQ5V1GN9e2kQGU@dpg-cjh827r37aks739hc21g-a/urbancribsdbinstance",
    config
  );
}

fs.readdirSync(__dirname)
  .filter((file) => {
    return (
      file.indexOf(".") !== 0 && file !== basename && file.slice(-3) === ".js"
    );
  })
  .forEach((file) => {
    const model = require(path.join(__dirname, file))(
      sequelize,
      Sequelize.DataTypes
    );
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
