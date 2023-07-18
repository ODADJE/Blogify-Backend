const mongoose = require("mongoose");
//connect to db

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://blogify:passer1234@mern-blog-v1.ast4wma.mongodb.net/mern-blog?retryWrites=true&w=majority"
    );
    console.log("DB has been connected");
  } catch (error) {
    console.log("DB Connection failed", error.message);
  }
};

module.exports = connectDB;
