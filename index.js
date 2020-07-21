
const express=require("express");
const bodyParser=require("body-parser");
const https=require("https");
const { json } = require("body-parser");
const { stringify } = require("querystring");
const mongoose = require('mongoose');
var session=require("express-session");

mongoose.connect('mongodb+srv://aravindh:aravindh@cluster0-tcbsv.mongodb.net/userDB?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true});

const userSchema= new mongoose.Schema({
    name:String,
    emailID:String,
    gk:{
        type: Number,
        default: null
    },
    movie:{
        type: Number,
        default: null
    },
    tv:{
        type: Number,
        default: null
    },
    game:{
        type: Number,
        default: null
    },
    cs:{
        type: Number,
        default: null
    },
    anime:{
        type: Number,
        default: null
    },
    date:{
      type: Date,
      default: Date.now
  }
}); 

const Login=mongoose.model("Login",userSchema);

const app=express()
app.use(bodyParser.urlencoded({extended:true}));
app.set("view engine","ejs");
app.use(express.static('public'));
app.use(session({secret:"youcantfindme"})); 

///////////////////////////////-------global variables-------/////////////////////////////////////
var userName;
var mailId;
var marks;
var category;

///////////////////////////------login-------///////////////////////////////////////
app.get("/",function(request,response){
    request.session.destroy();
     response.sendFile(__dirname+"/public/login.html");
})
var login;

app.post("/verify",function(request,response){
    console.log(request.body);   
    mailId=request.body.emailId;
        userName=request.body.userId;

    Login.findOne({name:userName}, function(err, result) {
        if (err) { console.log(err); }
    
        if (result) {
                if(mailId==result.emailID)
                {
                    console.log("Same user");
                    response.send("not taken");
                }
                else if(mailId!=result.emailID){
                    console.log("Username Taken");
                    response.send("taken");
                }
        } else {
            console.log("cant find");
                response.send("not taken");

        }
  
});

});

app.post("/",function(req,res){
    console.log("submit");
    console.log(req.body);
    var uname=req.body.userId;
    var mailId=req.body.emailId;
    
    req.session.uname=userName;
    req.session.mailId=mailId;

    Login.findOne({name:userName}, function(err, result) {
        if (err) { console.log(err); }
    
        if (result) {
                if(mailId==result.emailID)
                {
                    res.redirect("/home");
                }
                else if(mailId!=result.emailID){
                }
        } else {
    
            console.log("Database entry");
           login= new Login({
               name:userName,
               emailID:mailId,
            });
            login.save();
            res.redirect('/home');
        }

});
});
var leader={
    gk:[],
    movie:[],
    tv:[],
    game:[],
    cs:[],
    anime:[]
};

////////////////////////////////////////////////////////////////////-----home-------///////////////////////////////////
app.get("/home",function(request,response){

if(!request.session.uname){

    response.redirect("/")
}
else{
    Login.find(function(err,log){
        if(err){
           console.log("error");
            }
        else{
            leader.gk=[];
         log.forEach(element => leader.gk.push({name:element.name , score:element.gk}));
            }
         //    console.log(leader.gk);
         }).sort({gk:-1,date:-1}).limit(5);
         
        
         Login.find(function(err,log){
             if(err){
                console.log("error");
             }
             else{
                leader.movie=[];
              log.forEach(element => leader.movie.push({name:element.name , score:element.movie}));
                 }
     
              }).sort({movie:-1,date:-1}).limit(5);
         
             Login.find(function(err,log){
                 if(err){
                    console.log("error");
                 }
                 else{
                    leader.tv=[];
                  log.forEach(element => leader.tv.push({name:element.name , score:element.tv}));
                     }
                  }).sort({tv:-1,date:-1}).limit(5);
         
                  Login.find(function(err,log){
                     if(err){
                        console.log("error");
                     }
                     else{
                        leader.game=[];
                      log.forEach(element => leader.game.push({name:element.name , score:element.game}));
                         }
                      }).sort({game:-1,date:-1}).limit(5);
         
                      Login.find(function(err,log){
                         if(err){
                            console.log("error");
                         }
                         else{
                            leader.cs=[];
                          log.forEach(element => leader.cs.push({name:element.name , score:element.cs}));
                             }
                          }).sort({cs:-1,date:-1}).limit(5);
                          Login.find(function(err,log){
                             if(err){
                                console.log("error");
                             }
                             else{
                                leader.anime=[];
                              log.forEach(element => leader.anime.push({name:element.name , score:element.anime}));
                                 }
                                console.log(leader);
                                response.render("home",{top:leader});
                              }).sort({anime:-1,date:-1}).limit(5);
     
                            }
});

var catType;
var cat={
    "9":"gk",
    "11":"movie",
    "14":"tv",
    "15":"game",
    "18":"cs",
    "31":"anime",
}

app.post("/home",function(req,res){
    console.log(req.body.btn1);
    category=req.body.btn1;
    catType=cat[category];
    console.log(catType);
    res.redirect("/question")
});

//////////////////////////////////////////------question-------///////////////////////////////////////////////////////////////////
app.get("/question",function(request,response)
{
    if(!category){
        response.redirect("/home");
    }
    else{
    const url="https://opentdb.com/api.php?amount=10&category="+category+"&difficulty=easy&type=multiple";
    https.get(url,function(res)
    {
        res.on("data",function(data)
        {
            const trivia=JSON.parse(data);
            var temp=[];
                for(var i=0;i<10;i++)
                {
                    temp.push({ques:trivia.results[i].question,ans:trivia.results[i].correct_answer,options:trivia.results[i].incorrect_answers});
                }
                // console.log(temp)
                 for(var i=0;i<10;i++)
                {
                    temp[i].options=randomize(temp[i].ans,temp[i].options);
                  
                 }
                 response.render("question",{total:temp});
                
        });
    });
    }
});
//randomize option
function randomize(ans,options){
    options.push(ans);
    var j, x, i;
    for (i = options.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = options[i];
        options[i] = options[j];
        options[j] = x;
    }
    return options;
}


///////////////////////////////////////////for result//////////////////////////////////////////////////////////////

var report={};
app.post("/question",function(req,res)
{   
    console.log("recieved");
    console.log(req.body);
    if(JSON.stringify(req.body) === '{}')
    {
    console.log("empty");
    }
    else{
        console.log("report stored");
        report=req.body;
        Login.updateOne({name:userName},
                {[catType]: report.answeredCorrect},
                function(err) {
            if(err){
                console.log(err);
            }
            else{
                console.log("Succesfully updated");
            }
        });
   
     }
     res.redirect("/result");
});


app.get("/result",function(req,res)
 {  
     if(!report){
         res.redirect("/home");
     }
     else{
    res.render("result",{points:report});
     }
});


let port=process.env.PORT;
if(port == null || port == ""){
    port=3000;
}

app.listen(port);


