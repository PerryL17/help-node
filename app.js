const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.status(200).send("home page");
});
app.get("/list", (req, res) => {
  res.status(200).send("help listings");
});
app.post("register", (req, res) => {
  res.send("welcome user");
});
app.all("*", (req, res) => {
  res.status(404).send("<h2>page not found</h2>");
});
app.listen(5000, () => {
  console.log("server is listening on port 5000...");
});

//app.post
//app.put
//app.delete
//app.all
//app.use.
