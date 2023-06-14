const mongoose = require("mongoose");
mongoose
  .connect("mongodb://localhost:27017/new-chat-app", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Database connected successfully");
  })
  .catch((error) => {
    console.error("Error connecting to database:", error.message);
  });
