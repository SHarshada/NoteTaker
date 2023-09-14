var notesDb = require("../db/db.json");

var express = require("express");

var fs = require("fs");

var path = require("path");

var app = express();

require("./htmlRoutes")(app);

module.exports = function(app) {
  app.get("/api/notes", function(req, res) {
    res.json(notesDb);
    console.log(
      "Received a ".concat(req.method, " request from ").concat(req.url)
    );
  });
  app.post("/api/notes", function(req, res) {
    console.log(
      "Received a ".concat(req.method, " request from ").concat(req.url)
    );
    var newNote = req.body;
    notesDb.push(newNote);
    fs.writeFile("./db/db.json", JSON.stringify(notesDb), function(err) {
      if (err) throw err;
      console.log("Note ".concat(newNote.id, " added to db"));
      res.sendFile(path.join(__dirname, "../public/notes.html"));
    });
  });
  app.delete("/api/notes/:id", function(req, res) {
    var deleteNote = req.params.id;
    var noteUpdate = notesDb.filter(function(note) {
      return note.id !== deleteNote;
    });
    fs.writeFile("./db/db.json", JSON.stringify(noteUpdate), function(err) {
      if (err) throw err;
      console.log("Note ".concat(deleteNote, " deleted"));
      res.json({
        ok: true
      });
    });
  });
}
