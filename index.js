require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;
const cors = require("cors");
const bodyParser = require("body-parser");
const errorHanding = require("./middlewares/errorHanding");

// app.use(
//   express.json({
//     strict: false,
//   })
// );
// app.use(cors());
app.use(express.json()); // body-parser is now deprecated as of Express 4.16+
// app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.json());
app.use(cors());
//Ini buat error Handingling
app.use(errorHanding);

app.get("/test-connection", (req, res) => {
  return res.status(200).send("ok");
});
const router = require("./routers");
app.use("/api/v1", router);
app.get("/", (req, res) => {
  res.json({
    message: "Welcome client.",
  });
});

app.use("*", (req, res) => {
  return res.status(404).json({
    error: "End Poinst is Not Register Not Found 404",
  });
});

app.listen(PORT, () => {
  console.log(`Server is Running at PORT ${PORT}`);
  console.log(`Server is running on http://localhost:${PORT}`);
});
