const express = require("express");
const { connection } = require("./config/db.js");
const { UserRoute } = require("./routes/user.route");

const app = express();
app.use(express.json());

app.use("/user", UserRoute);

app.listen(8080, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log("Failed to Connect to DB");
    console.log(err);
  }
  console.log("Listening on port 8080");
});
