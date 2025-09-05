const mongoose = require('mongoose');
const initdata = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URI = 'mongodb://127.0.0.1:27017/wonderlust';

main().then(()=>{
    console.log("Connected to MongoDB");
}).catch(err => console.log(err));

async function main() {
  await mongoose.connect(MONGO_URI);
}

const initDB = async()=>{
    await Listing.deleteMany({});
    await Listing.insertMany(initdata.data);
    console.log("Database initialized with sample data");
}

initDB()