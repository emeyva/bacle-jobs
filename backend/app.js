const express = require("express");
const bodyParser = require("body-parser");

const extraJobsRoutes = require("./routes/extraJobs-routes");
const usersRoutes = require("./routes/users-routes");
const companiesRoutes = require("./routes/companies-routes");
const interactionsRoutes = require("./routes/interactions-routes");
const newsletterRoutes = require("./routes/newsletter-routes");
const usersLevelsRoutes = require("./routes/usersLevel-routes");
const usersStatusRoutes = require("./routes/usersStatus-routes");
const shiftsRoutes = require("./routes/shifts-routes");

const HttpError = require("./utils/http-error");

const app = express();
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE");

  next();
});

app.use("/api/extraJobs", extraJobsRoutes);
app.use("/api/shifts", shiftsRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/companies", companiesRoutes);
app.use("/api/interactions", interactionsRoutes);
app.use("/api/newsletter", newsletterRoutes);
app.use("/api/usersLevel", usersLevelsRoutes);
app.use("/api/usersStatus", usersStatusRoutes);

app.use((req, res, next) => {
  throw new HttpError("Could not find this route", 404);
});

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "An unkown error occurred!" });
});

app.listen(process.env.PORT || 5000);
