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
import("./routes")
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);


var syncOptions = { force: false };

// If running a test, set syncOptions.force to true
// clearing the `testdb`
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












// nodemailer

app.post("/form", (req, res) => {

var email = req.body.email;
var message = req.body.message
var name = req.body.name;

console.log("email: " + email, "name: " + name)

const output =`<p> You have a new contact request </p>
    <P> 😎Thank you for joing the squad 😎</p>
    <p>From: ${req.body.fromUser}</p>
    <p>Interest: ${req.body.interest}</p>
    <p>${req.body.message}</p>
    </ul>`;

const nodemailer = require('nodemailer');

let transporter =  nodemailer.createTransport({
    service : "gmail",

    auth: {
        user: "bucketlistusa271@gmail.com",
        pass: process.env.EMAIL_PW
    }
});



let mailoptions  = {
    from: "bucketlistusa271@gmail.com", // sender address
    to: `${email}`, // list of receivers
    subject: 'registration ✔', // Subject line
    text: `Hey ${name}`, // plain text body
    html: output
};

transporter.sendMail(mailoptions, (err, data) =>{
if (err){
    console.log(err)
}else{ console.log("email sent")}
});


  res.send("its okay")
})


















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

app.listen(process.env.PORT || 8080, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


