const shortid = require("shortid");
const URL = require("../models/url");

async function hadleGenerateShortUrl(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });

  const shortId = shortid.generate(); // Correct usage of shortid to generate an ID
  await URL.create({
    shortId: shortId,
    redirectUrl: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });
  return res.render("home", { id: shortId });
}

async function hadleGetAnalytics(req, res) {
  const shortId = req.params.shortId;
  console.log("1");
  const result = await URL.findOne({ shortId });
  console.log("2");
  if (!result) {
    return res.status(404).json({ error: "URL not found" });
  }

  console.log("Visit history length:", result.visitHistory.length);
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  hadleGenerateShortUrl,
  hadleGetAnalytics,
};
