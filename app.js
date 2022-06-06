const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(bodyParser.urlencoded({extended: true}));

// We have put all of our static files in public folder and will access those files relative to the static folder in html file
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});

app.post("/",function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us14.api.mailchimp.com/3.0/lists/04fd5ccabf";
    const options = {
        method: "POST",
        auth: "abhala:7379795c11a3601a7159a049fc8a5492-us14"
    }
    // Below is the code through which we can use https module to post a request. 
    // https://nodejs.org/api/https.html#httpsrequesturl-options-callback
    const request = https.request(url, options , function(response){
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html");
        }else{
            res.sendFile(__dirname + "/failure.html");
        }
        // through response.on() we are checking on the data the we have received.
        response.on("data",function(data){
            console.log(JSON.parse(data));
        })
    })

    // To actually send the data over to mailchimp server and store our user's details.
    // https://nodejs.dev/learn/making-http-requests-with-nodejs
    request.write(jsonData);
    request.end();
});

app.post("/failure", function(req,res){
    res.redirect("/");
});

// We are using process.env.PORT and not hardcoding the Port number so that heroku can run our application at whichever port it wants.
app.listen(process.env.PORT || 3000,function(){
    console.log("The server is running at port 3000.");
});

// 7379795c11a3601a7159a049fc8a5492-us14

// 04fd5ccabf