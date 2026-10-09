const mongoose = require("mongoose");

// function to connect

const dbConnect = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("DB Connected");
  } catch (error) {
    console.log("\n error.message ----->", error.message);
    process.exit(1);
  }
};

dbConnect();
