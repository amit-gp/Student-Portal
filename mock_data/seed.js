const mongoose = require("mongoose");
const staffData = require("./mock_data/mock_staff_data.json");
const studentData = require("./mock_data/mock_student_data.json");
const User = require("./schemas/UserModel");
const fs = require("fs");
const insertData = async (model, data) => {
  try {
    await model.insertMany(data);
  } catch (err) {
    console.log(err);
  }
  console.log("Populated Successfully");
};
const populateData = async () => {
  const mongooseOptions = {
    useNewUrlParser: true,
  };

  mongoose.connect(
    "mongodb://localhost:27017/studentportal",
    mongooseOptions,
    (err) => {
      if (err) {
        console.log(
          "Error connecting to the MongoDB database... terminating now."
        );
        process.exit();
      }
      console.log("Connected to MongoDB successfully.");
    }
  );

  await insertData(User, staffData);
  await insertData(User, studentData);
  mongoose.disconnect();
};

populateData();
