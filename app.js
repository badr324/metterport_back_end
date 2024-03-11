const express = require("express");
const app = express();
const cors = require("cors");
const Metaport = require("./Metaport");
const basicAuth = require("express-basic-auth");
const Api_access = require("./Api_access");

require("dotenv").config();

// Middleware Connections
app.use(cors());
app.use(express.json());

// Routes

const authMiddleware = basicAuth({
  users: {
    [process.env.LOGIN_EMAIL]: process.env.LOGIN_PASSWORD,
  },
  unauthorizedResponse: (req) => {
    return "Unauthorized";
  },
});

app.get("/", authMiddleware, async (req, res) => {
  // const data = await Metaport.authenticateAndScrapeData();
  const models = await Api_access.getModels();
  res.json(models);
});

// Connection
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("App running in port: " + PORT);
});
