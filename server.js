var express = require("express");

var app = express();

var path = require("path");

app.use(
  express.urlencoded({
    extended: true
  })
);
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')))

require("./routes/apiRoutes")(app);

require("./routes/htmlRoutes")(app);

var PORT = process.env.PORT || 8080;
app.listen(PORT, function() {
  console.log("App listening on PORT " + PORT);
});