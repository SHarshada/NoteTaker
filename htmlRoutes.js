var path = require("path");

module.exports = function(app) {
  app.get("/", function(req, res) {
    console.log("Received a ".concat(req.method, " from URL ").concat(req.url));
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
  app.get("/notes", function(req, res) {
    console.log("Received a ".concat(req.method, " from URL ").concat(req.url));
    res.sendFile(path.join(__dirname, "../public/notes.html"));
  });
  app.get("*", function(req, res) {
    console.log("Received a ".concat(req.method, " from URL ").concat(req.url));
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
};