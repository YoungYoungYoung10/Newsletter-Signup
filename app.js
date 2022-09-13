const express = require("express");
const app = express();
const https = require('https');
const request = require("request");

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended:true}));


//in order for our server to serve up local files such CSS and images,
//then we need to use a special function of express
app.use(express.static("public"));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html")
})

app.post("/",function(req,res){
    const firstName = req.body.first_name
    const lastName = req.body.last_name
    const email = req.body.email
    const data = {
        members:[
            {
                email_address:email,
                status:"subscribed",
                merge_fields:{
                    FNAME:firstName,
                    LNAME:lastName,
                },
            }
        ]
    };
    const jsonData = JSON.stringify(data);
    const url = "https://us17.api.mailchimp.com/3.0/lists/41941efa21"
    const options = {
        method:"POST",
        auth:"young1:bda8afec71f6ad1bf521fb983a1858e5-us17",
    };

    //这里为什么要把https request放在一个const里面？参见:笔记.text第五条
    const request = https.request(url,options,function(response){
        response.on("data",function(data){
            console.log(JSON.parse(data));
        });
        if (response.statusCode === 200){
            res.sendFile(__dirname + "/sucess.html")
        }else{
            res.sendFile(__dirname + "/failure.html")
        };
    })

    //这里为什么要写request.write(jsonData)？参见:笔记.text第五条
    request.write(jsonData);
    request.end();
})

//捕捉"/failure"传送回来的post请求
app.post("/failure",function(req,res){
    res.redirect("/")
})

//捕捉"/sucess"传送回来的post请求
app.post("/sucess",function(req,res){
    res.redirect("/")
})

//process.env.port是用于heroku时的写法，后面接着3000代表的是
//能够让这个website同时在两个端口运行
app.listen(process.env.PORT || 3000,function(){
    console.log("server is running on port:3000")
});

//API Key:
//bda8afec71f6ad1bf521fb983a1858e5-us17

//List Id:
//41941efa21.