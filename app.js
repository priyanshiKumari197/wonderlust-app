const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wonderlust';


main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(MONGO_URL);
}


app.engine('ejs', ejsMate);   // ejs-mate ko register kiya
app.set('view engine', 'ejs'); // ejs ko view engine set kiya
app.set('views', path.join(__dirname, 'views')); // views folder set kiya
app.use(express.static(path.join(__dirname, "public/css")))
app.use(express.urlencoded({ extended: true })); //post ke liye hota hai
app.use(methodOverride("_method")); // put ,patch and delete requst ke liye


app.get("/", (req, res) => {
  res.send("Hi, I am root");
});

//Index Route
app.get("/listings", async (req, res) => {
  const listingsOfData = await Listing.find({});
  res.render("listings/index.ejs", { listingsOfData });
});
// new Route
app.get("/listings/new", (req, res)=>{
  res.render("listings/new.ejs")
})

//Show Route
app.get("/listings/:id", async(req, res)=>{
  let {id} = req.params;
   const listing = await Listing.findById(id);
   res.render("listings/show.ejs", {listing})
 
})
// create Route
app.post("/listings",async (req, res)=>{
  let newListing = new Listing(req.body.listing)
  await newListing.save()
  res.redirect("/listings")
})
// edit Route
app.get("/listings/:id/edit", async (req, res)=>{
  let {id} = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs",{ listing })
})

app.put("/listings/:id",async (req,res)=>{
  let { id } = req.params;
  await Listing.findByIdAndUpdate(id, {...req.body.listing});
  res.redirect("/listings")
})
// delete Route
app.delete("/listings/:id",async (req,res)=>{
  let { id } = req.params;
  let deleted = await Listing.findByIdAndDelete(id);
  console.log(deleted);
  res.redirect("/listings")
})


// app.get("/testListing", async (req, res) => {
//   let sampleListing = new Listing({
//     title: "My New Villa",
//     description: "By the beach",
//     price: 1200,
//     location: "Calangute, Goa",
//     country: "India",
//   });

//   await sampleListing.save();
//   console.log("sample was saved");
//   res.send("successful testing");
// });

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});