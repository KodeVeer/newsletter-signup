

const express =require("express");
const bodyParser=require("body-parser");
const https=require("https");
require('dotenv').config()

const app=express();

app.use(express.static("public"))
app.use(bodyParser.urlencoded({extended: true}))

app.get("/", function(req,res){
   res.sendFile(__dirname+"/signup.html") 
})

app.post("/", function(req, res){
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;

    //Object of the user's data
    const data={
        members:[
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]

    }

    const jsonData=JSON.stringify(data)

    //Sending data to mailchimp server
    const url=`https://us11.api.mailchimp.com/3.0/lists/${process.env.MAILCHIMP_UNIQUE_ID}`
    const options={
        method: "POST",
        auth: process.env.MAILCHIMP_API_KEY
    }
    const requests=https.request(url, options, function(response){
        if (response.statusCode===200){
            res.sendFile(__dirname+"/success.html")
        } else{
            res.sendFile(__dirname+"/failure.html")
        }
        
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })

    })
    requests.write(jsonData)
    requests.end()
        
    })
    // Route for failure page to signup page
    app.post("/failure", function(req, res){
        res.redirect("/")
    })

app.listen(process.env.PORT || 3000, function(){
    console.log("Server is Running");
})

