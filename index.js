const express = require("express");
const mongoose = require("mongoose");
const urlRoute = require("./routes/url");
const connectMongoDb = require("./connect");
const URL = require("./models/url");
const { timeStamp, log } = require("console");
const path = require("path");
const staticRoute = require("./routes/staticRouter");
const userRoute = require("./routes/user");
const cookieParser = require("cookie-parser");
const { checkForAuthenticaton, restrictTo } = require("./middleware/auth");

connectMongoDb("mongodb://localhost:27017/short-url").then(() =>
  console.log("Mongodb connected")
);

const app = express();
const port = 8001;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthenticaton);

app.use("/url", restrictTo(["NORMAL", "ADMIN"]), urlRoute);
app.use("/user", userRoute);

app.set("view engine", "ejs");
app.set("views", path.resolve("./views"));

app.use("/", staticRoute);

app.get("/url/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    { shortId },
    {
      $push: {
        visitHistory: { timestamp: Date.now() },
      },
    },
    { new: true }
  );
  res.redirect(entry.redirectUrl);
});

app.listen(port, () => console.log(`server started at ${port}`));
