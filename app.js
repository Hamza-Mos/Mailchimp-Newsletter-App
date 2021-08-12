const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const request = require('superagent');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.listen(process.env.PORT || 3000, function() {
  console.log("Server is running on port 3000.");
});

app.get("/", function(req, res){
  res.sendFile(__dirname + "/signup.html");
});
var mailchimpInstance   = 'us5',
listUniqueId        = 'dfd0daf722',
mailchimpApiKey     = '393ecd3231fba7d08cc7d8a4ddeb4549-us5';

app.post('/', function (req, res) {

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

request
    .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
    .set('Content-Type', 'application/json;charset=utf-8')
    .set('Authorization', 'Basic ' + Buffer.from('any:' + mailchimpApiKey ).toString('base64'))
    .send({
      'email_address': email,
      'status': 'subscribed',
      'merge_fields': {
        'FNAME': firstName,
        'LNAME': lastName
      }
    })
        .end(function(err, response) {
          if (response.status < 300) {
            res.sendFile(__dirname + "/success.html");
          } else {
            res.sendFile(__dirname + "/failure.html");
          }
      });
});

app.post("/failure", function(req, res){
  res.redirect("/");
})
