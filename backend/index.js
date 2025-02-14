import app from "./app.js";
import mongoose from "mongoose";


import dotenv from "dotenv";
dotenv.config(); 

// Set up MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to DB");

   
  })
  .catch((e) => {
    console.log("Error connecting to DB", e);
  });



// Start the server
let port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port} 🚀`);
});
