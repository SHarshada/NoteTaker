// I updated some of the code to ES6 syntax for the sake of practice
var $noteTitle = $(".note-title");
var $noteText = $(".note-textarea");
var $saveNoteBtn = $(".save-note");
var $newNoteBtn = $(".new-note");
var $noteList = $(".list-container .list-group"); // activeNote is used to keep track of the note in the textarea

var activeNote = {}; // A function for getting all notes from the db

var getNotes = function getNotes() {
  return $.ajax({
    url: "/api/notes",
    method: "GET"
  });
}; // A function for saving a note to the db

var saveNote = function saveNote(note) {
  return $.ajax(
    {
      url: "/api/notes",
      data: note,
      method: "POST"
    } 
  );
}; // A function for deleting a note from the db

var deleteNote = function deleteNote(id) {
  return $.ajax({
    url: "api/notes/".concat(id),
    data:id,
    method: "DELETE"
  });
}; // If there is an activeNote, display it, otherwise render empty inputs

var renderActiveNote = function renderActiveNote() {
  $saveNoteBtn.hide();

  if (activeNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(activeNote.title);
    $noteText.val(activeNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
}; 

var length = 8;
var timestamp = +new Date();

var _getRandomInt = function _getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

var generateID = function generateID() {
  var ts = timestamp.toString();
  var parts = ts.split("").reverse();
  var id = "";

  for (var i = 0; i < length; ++i) {
    var index = _getRandomInt(0, parts.length - 1);

    id += parts[index];
  }

  return id;
}; // Get the note data from the inputs, save it to the db and update the view

var handleNoteSave = function handleNoteSave() {
  var id = generateID();
  var newNote = {
    id: id,
    title: $noteTitle.val(),
    text: $noteText.val()
  };
  saveNote(newNote).then(function(data) {
    getAndRenderNotes();
    renderActiveNote();
  });
}; // Delete the clicked note

var handleNoteDelete = function handleNoteDelete(event) {
  // prevents the click listener for the list from being called when the button inside of it is clicked
  event.stopImmediatePropagation();
  var note = $(this)
    .parent(".list-group-item")
    .data();

  if (activeNote.id === note.id) {
    activeNote = {};
  }

  deleteNote(note.id).then(function(data) {
    var el = document.getElementById(note.id);
    el.remove();
  });
};

var handleNoteView = function handleNoteView() {
  activeNote = $(this).data();
  renderActiveNote();
}; // Sets the activeNote to an empty object and allows the user to enter a new note

var handleNewNoteView = function handleNewNoteView() {
  activeNote = {};
  renderActiveNote();
}; // If a note's title or text are empty, hide the save button
// Or else show it

var handleRenderSaveBtn = function handleRenderSaveBtn() {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveNoteBtn.hide();
  } else {
    $saveNoteBtn.show();
  }
}; // Render's the list of note titles

var renderNoteList = function renderNoteList(notes) {
  $noteList.empty();
  var noteListItems = [];

  for (var i = 0; i < notes.length; i++) {
    var note = notes[i];
    var $li = $("<li class='list-group-item'>").data(note);
    var $span = $("<span>").text(note.title);
    var $delBtn = $(
      "<i class='fas fa-trash-alt float-right text-danger delete-note'>"
    );
    $li.append($span, $delBtn).attr("id", note.id);
    noteListItems.push($li);
  }

  $noteList.append(noteListItems);
}; // Gets notes from the db and renders them to the sidebar

var getAndRenderNotes = function getAndRenderNotes() {
  return getNotes().then(function(data) {
    renderNoteList(data);
  });
};

$saveNoteBtn.on("click", handleNoteSave);
$noteList.on("click", ".list-group-item", handleNoteView);
$newNoteBtn.on("click", handleNewNoteView);
$noteList.on("click", ".delete-note", handleNoteDelete);
$noteTitle.on("keyup", handleRenderSaveBtn);
$noteText.on("keyup", handleRenderSaveBtn); // Gets and renders the initial list of notes

getAndRenderNotes();
