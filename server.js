require('dotenv').config()
var express = require("express");
var db = require("./models");

var app = express();



var PORT = process.env.PORT || 8000;



// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// Handlebars
var exphbs = require("express-handlebars");
app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

var Handlebars = require('handlebars');

Handlebars.registerHelper("inc", function(value, options)
{
    return parseInt(value) + 1;
});




// Routes

require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
if (process.env.NODE_ENV === "development") {
  syncOptions.force = true;

  app.get("/", (req, res) => res.render("login",{}))
}



if (process.env.NODE_ENV === "production") {
  syncOptions.force = true;

  app.get("/", (req, res) => res.render("login",{}))
}










app.get("/profile/:id", (req, res) => {
  let hbsobj = {}
  orm.selectAUsersItems(req.params.id, (myItemsData) => {
    hbsobj.myitems = myItemsData
    orm.selectTopTen((topItemsData) => {
      hbsobj.topitems = topItemsData  
      console.log(hbsobj)
      res.render("profile", hbsobj)
    })
  })
})

app.get("/", (req, res) => res.render("login",{}))

  

// Render 404 page for any unmatched routes
app.get("*", function(req, res) {
  res.send("404");
});




app.get('/', function(req, res, next){
  res.sendStatus(200);
});






// Starting the server, syncing our models ------------------------------------/
db.sequelize.sync(syncOptions).then(function(f) {
  app.listen(process.env.PORT || PORT, function() {
    console.log(
      "==> 🌎  Listening on port %s. Visit http://localhost:%s/ in your browser.",
      PORT,
      PORT
    );
  });


});

module.exports = app;


