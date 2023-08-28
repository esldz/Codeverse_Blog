const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require('mongoose');

const aboutContent = "While learning new information about the software, I will share the information I learned on this software blog.";

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect('mongodb://localhost:27017/BlogDB', { useNewUrlParser: true });

const postSchema = new mongoose.Schema({
  title: String,
  text: String
});

const Post = mongoose.model('Post', postSchema);

app.get("/", async (req, res) => {
  try {
    const posts = await Post.find({});
    res.render("home.ejs", { posts: posts });
  } catch (err) {
    console.error(err);
    res.status(500).send("Veritabanı hatası");
  }
});

app.get("/about", (req, res) => {
  res.render("about.ejs", { aboutContent: aboutContent });
});

app.get("/contact", (req, res) => {
  res.render("contact.ejs");
});

app.get("/compose", (req, res) => {
  res.render("compose.ejs");
});

app.post("/compose", async (req, res) => {
  const post = new Post({
    title: req.body.postTitle,
    text: req.body.postText
  });

  try {
    await post.save();
    res.redirect("/");
  } catch (err) {
    console.error(err);
    res.status(500).send("Veritabanı hatası");
  }
});

app.get("/posts/:postName", async (req, res) => {
  const requestTitle = _.lowerCase(req.params.postName);

  try {
    const post = await Post.findOne({ title: requestTitle });
    if (post) {
      res.render("post", {
        title: post.title,
        text: post.text
      });
    } else {
      res.status(404).render("pageNotFound.ejs");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Veritabanı hatası");
  }
});

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
