const express = require("express");
const router = express.Router({
  mergeParams: true,
});
const fileUpload = require("express-fileupload");
const { ensureAuthenticated, checkIfStaff } = require("../configs/auth");
const Result = require("../schemas/ResultModel");
const path = require("path");
const fs = require("fs");
const User = require("../schemas/UserModel");

const importCSVToMongo = async (file) => {
  const csv = fs.readFileSync(file);
  const array = csv.toString().split("\r\n");
  let headers = array.shift().split(",");
  let rowResult = [];
  let cgpa = 0;
  for (let index = 0; index < array.length; index++) {
    const row = array[index];
    let subjects = row.split(",");
    rowResult = [];
    cgpa = 0;
    for (let element = 1; element < subjects.length; element++) {
      const subject = subjects[element];
      const header = headers[element];
      cgpa += parseInt(subject);
      rowResult.push({ subject: header, marks: subject });
    }
    try {
      const usn = subjects[0];
      const user = await User.findOne({ userId: usn });
      const result = new Result({ subjects: rowResult });
      result.student = user._id;
      result.cgpa = Math.round(cgpa / 6, 2);
      await result.save();
    } catch (err) {
      console.log(err);
    }
  }
};

router.use(fileUpload({ createParentPath: true, useTempFiles: true }));

router.get("/", ensureAuthenticated, async (req, res) => {
  if (!req.user.isStaff) {
    const result = await Result.findOne({ student: req.user._id });
    res.render("results", { user: req.user, result, page: "results" });
  } else {
    res.render("results", { user: req.user, page: "results" });
  }
});

router.get("/download-template", [ensureAuthenticated, checkIfStaff], function (
  req,
  res
) {
  const file = `${__dirname}/../download/Template.csv`;
  res.download(file);
});

router.post("/upload", [ensureAuthenticated, checkIfStaff], function (
  req,
  res
) {
  if (!req.files || Object.keys(req.files).length === 0) {
    req.flash("error_msg", "No files were uploaded.");
    res.redirect("/results");
    return;
  }
  let uploadedFile = req.files.resultsFile;
  const filename = `results_${req.user.userId}.csv`;
  const uploadPath = path.join(__dirname, "../uploaded/", filename);
  uploadedFile.mv(uploadPath, function (err) {
    if (err) {
      req.flash("error_msg", "Error uploading result.");
      res.redirect("/results");
      return;
    }
    importCSVToMongo(uploadPath)
      .then(() => {
        req.flash("success_msg", "Result uploaded successfully");
        res.redirect("/results");
        return;
      })
      .catch((err) => {
        req.flash("error_msg", "Error uploading result.");
        res.redirect("/results");
      });
  });
});

module.exports = router;
