// DEPENDENCIES
// ==============================================================================
const express = require("express");
const path = require("path");
const bodyParser = require('body-parser')
const fs = require('fs');
// const customer = JSON.parse(fs.readFileSync("./db/db.json"));

// EXPRESS CONFIGURATION
// ==============================================================================
const app = express();
const PORT = process.env.PORT || 8080;

console.log("dirname is " + __dirname);
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());


// LISTENER
// =============================================================================
app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});

// HTML/API ROUTING
// ================================================================================

//HTML

app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, "public/index.html"));
});

app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, "public/notes.html"));
});

//API GET Requests
app.get("/api/notes", function (req, res) {
  const customer = JSON.parse(fs.readFileSync("./db/db.json"));
  res.json(customer);
});

// API POST Requests
let id = 1;
app.post("/api/notes", function (req, res) {
  req.body.id = id;
  id++;
  const customer = require("./db/db.json");
  customer.push(req.body);
  const customerAsString = JSON.stringify(customer);
  fs.writeFileSync(__dirname + "/db/db.json", customerAsString);
  res.end();
});

//API DELETE Requests
app.delete("/api/notes/:id", function (req, res) {
  const chosen = req.params.id;
  const customer = JSON.parse(fs.readFileSync("./db/db.json"));
  const filtered = customer.filter(function (note) {
    return note.id != chosen
  });
  fs.writeFileSync(__dirname + "/db/db.json", JSON.stringify(filtered));
  res.end();
});
