var express = require("express");
var router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  let title = "Urbancribs";
  let rootUrl = "127.0.0.1:8000";
  let rootApiUrl = "127.0.0.1:8000/api/v1";

  res.render("index", { title, rootUrl, rootApiUrl });
});

module.exports = router;
