const express = require("express");
const mongoose = require("mongoose");
const tabledata = require("./models/shorturl");
const app = express();

mongoose.connect("mongodb://localhost/urlshortner", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: false }));

app.get("/", async (req, res) => {
  let data = await tabledata.find();
  res.render("index", { tabledata: data });
});

app.get("/:id", async (req, res) => {
  let urlobject = await tabledata.findOne({ short: req.params.id });
  if (urlobject == null) return res.sendStatus(404);
  urlobject.clicks++;
  urlobject.save();

  res.redirect(urlobject.full);
});

app.post("/generate", async (req, res) => {
  await tabledata.create({ full: req.body.fullurl });
  res.redirect("/");
});

const port = process.env.PORT || 5500;
app.listen(port, (err) => {
  if (err) throw new err();
  else {
    console.log("server is running");
  }
});
