const mongoose = require("mongoose");
const dbUrl = process.env.MONGODB_URL;
const localUrl = "mongodb://localhost:27017/new-chat-app";
// mongodb+srv://orangeundies:<password>@cluster0.eaqxexu.mongodb.net/?retryWrites=true&w=majority

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error.message);
  });
