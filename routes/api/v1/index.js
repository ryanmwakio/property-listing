var express = require("express");
var router = express.Router();
const User = require("../../../models").User;
const UserType = require("../../../models").UserType;
const MembershipLevel = require("../../../models").MembershipLevel;
const Country = require("../../../models").Country;
const axios = require("axios");

/* GET home api route */
router.get("/", function (req, res, next) {
  return res.json({
    successful: true,
    status: "success",
    statusCode: 200,
    message: "Welcome to the UrbanCribs API",
    body: {},
    error: [],
  });
});

router.get("/run-scripts", async function (req, res, next) {
  try {
    // // script to run some automated scripts
    // // 1) create user types in UserType model
    const userTypes = [
      "superadmin",
      "admin",
      "agent",
      "realtor",
      "landlord",
      "normal",
    ];

    for (let i = 0; i < userTypes.length; i++) {
      await UserType.findOrCreate({
        where: {
          userType: userTypes[i],
        },
      });
    }
    // // 2) create membership levels
    const prices = [3000, 1500, 700, 200, 100];
    const membershipLevels = ["gold", "silver", "bronze", "normal"];
    for (let i = 0; i < membershipLevels.length; i++) {
      await MembershipLevel.findOrCreate({
        where: {
          membershipLevel: membershipLevels[i],
        },
        defaults: {
          membershipLevel: membershipLevels[i],
          price: prices[i],
        },
      });
    }

    // // 3) create countries in Countries model
    const countriesResponse = await axios.get(
      "https://restcountries.com/v3.1/all"
    );

    countriesResponse.data.forEach(async (country) => {
      await Country.findOrCreate({
        where: {
          country: country.name.common,
        },
        defaults: {
          country: country.name.common,
          region: country.region,
        },
      });
    });

    return res.json({
      successful: true,
      status: "success",
      statusCode: 200,
      message: "All scripts ran successfully",
      body: {},
      error: [],
    });
  } catch (error) {
    return res.json({
      successful: false,
      status: "error",
      statusCode: 500,
      message: "Error running scripts",
      body: {},
      error: [error],
    });
  }
});

module.exports = router;
