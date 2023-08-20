var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  let title = "Urbancribs";
  let rootUrl = "https://urbancribs.onrender.com";
  let rootApiUrl = "https://urbancribs.onrender.com/api/v1";

  res.render("index", { title, rootUrl, rootApiUrl });
});

module.exports = router;
