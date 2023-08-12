const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");

const aboutContent = "While learning new information about the software, I will share the information I learned on this software blog.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

var posts=[];

app.get("/",(req,res)=>{
  res.render("home.ejs", { posts : posts });
});

app.get("/about",(req,res)=>{
  res.render("about.ejs",{ aboutContent : aboutContent});
});

app.get("/contact",(req,res)=>{
  res.render("contact.ejs");
});

app.get("/compose",(req,res)=>{
  res.render("compose.ejs");
});

app.post("/compose",(req,res)=>{
  const post={
    title: req.body.postTitle,
    text: req.body.postText,
  };

  posts.push(post);
  res.redirect("/");
});

app.get("/posts/:postName",(req,res)=>{
  const requestTitle=(req.params.postName);

  for(i=0;i<posts.length;i++){
    if(_.lowerCase(posts[i].title)===_.lowerCase(requestTitle)){
      res.render("post",{
        title: posts[i].title,
        text: posts[i].text,
      });
     }
     else{
      res.status(404).render("pageNotFound.ejs");
     }
  };

  // for(i=0;i<posts.length;i++){
  //   if(_.lowerCase(posts[i].title)===_.lowerCase(requestTitle)){
  //     console.log("Match Found");
  //    }
  //    else{
  //     console.log("Not a match");
  //    }
  // };

  // posts.forEach(function(post){
  //   const storedTitle=post.title;

  //   if(storedTitle===requestTitle){
  //       console.log("Match Found!");
  //   }
  // });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
