require('dotenv').config();
const express = require("express");
const app = express();
const request = require('superagent');

app.use(express.static("public"));
app.use(express.urlencoded({extended: true})); 
app.use(express.json());

app.listen(process.env.PORT, function() {
  console.log("Server is running on the port.");
});

app.get("/", (req, res) => 
{
  res.sendFile(__dirname + "/signup.html");
});
var mailchimpInstance   = process.env.MAILCHIMP_INSTANCE,
listUniqueId        = process.env.LIST_UNIQUE_ID,
mailchimpApiKey     = process.env.MAILCHIMP_API_KEY;

app.post('/', (req, res) => 
{

  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

request
    .post('https://' + mailchimpInstance + '.api.mailchimp.com/3.0/lists/' + listUniqueId + '/members/')
    .set('Content-Type', 'application/json;charset=utf-8')
    .set('Authorization', 'Basic ' + Buffer.from('any:' + mailchimpApiKey ).toString('base64'))
    .send
    ({
      'email_address': email,
      'status': 'subscribed',
      'merge_fields': {
        'FNAME': firstName,
        'LNAME': lastName
      }
    })
        .end((err, response) => 
        {
          if (response.status < 300) {
            res.sendFile(__dirname + "/success.html");
          } else {
            res.sendFile(__dirname + "/failure.html");
          }
      });
});

app.post("/failure", (req, res) => 
{
  res.redirect("/");
})
