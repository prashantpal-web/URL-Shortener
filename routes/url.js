const express = require("express");
const router = express.Router();
const {
  hadleGenerateShortUrl,
  hadleGetAnalytics,
} = require("../controller/url");

router.post("/", hadleGenerateShortUrl);
router.get("/analytics/:shortId", hadleGetAnalytics);

module.exports = router;
