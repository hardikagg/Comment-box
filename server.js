require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mysql = require("mysql");
const multer = require("multer");
const fs = require("fs");
const crypto = require("crypto");
const http = require("http");
const path = require("path");
const busboy = require("then-busboy");
const fileUpload = require("express-fileupload");
const compression = require('compression')
const cookieSession = require("cookie-session");
const passport = require("passport");
const sharp = require("sharp");

// var busboy = require('connect-busboy');

// const session= require('express-session')

const keys = require("./config/keys");
const connection = require("./config/DBconnection");
const authRouter = require("./routes/authRouter");
const passportSetup = require("./config/passport-setup");


const AdminPassport = require("./config/Admin-passport");
const ReviewersPassport = require("./config/Reviewer-passport");

// const upload = require("./imageUpload");



// const authCheck = require("./config/authCheck");
// const RauthCheck=require("./config/RauthCheck");
const profileRouter = require("./routes/profileRouter");
const homeRouter = require("./routes/homeRouter");
const ReviewArticlesRouter = require("./routes/ReviewArticlesRouter");
const contributeRouter = require("./routes/contributeRouter");
const adminRouter = require("./routes/adminRouter");
const certiAuthRouter = require("./routes/certiAuthRouter");
// <<<<<<< b3
const InternRouter = require("./routes/internRouter");
// =======
// const Submission = require("./routes/submission");
const footerRouter = require("./routes/footerRouter");
const navbarRouter = require("./routes/navbarRouter");
// >>>>>>> master

const Submission = require("./routes/submission")


var upload_file = require('./froalaEditorFiles/file_upload.js');
var upload_image = require('./froalaEditorFiles//image_upload.js');
const authCheck = require("./config/authCheck");

const app = express();





// const fileStorage = multer.diskStorage({
//     destination:(req,file,cb)=>{
//        cb(null,"public/ProfileImages") ;
//     },
//     filename:(req,file,cb)=>{
//       cb(null,new Date().toISOString()+"-"+file.originalname);
//     }
// });

const filefilter = (req, file, cb) => {
  if (file.mimetype == "image/jpeg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/jpg") {
    cb(null, true);
  }
  else {
    cb(null, false);
  }
}

app.set("view engine", "ejs");

app.use(express.static(__dirname + "/"));
app.use(express.static(__dirname + "/public"));
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

// app.use(multer({
//   storage:fileStorage,
//   fileFilter:filefilter
// }).single("uploaded_image"));

//CKeditor imageUploadroutes///////////////////////////////////
// app.get("/files", function (req, res) {
//   const images = fs.readdirSync("public/upload");
//   var sorted = [];
//   for (let item of images) {
//     if (
//       item.split(".").pop() === "png" ||
//       item.split(".").pop() === "jpg" ||
//       item.split(".").pop() === "jpeg" ||
//       item.split(".").pop() === "svg"
//     ) {
//       var abc = {
//         image: "/upload/" + item,
//         folder: "/",
//       };
//       sorted.push(abc);
//     }
//   }
//   res.send(sorted);
// });
// // upload image to folder upload
//   app.post('/upload', upload.array('flFileUpload', 12), function (req, res, next) {
//       res.redirect('back')
//   });
//   delete file
//   app.post('/delete_file', function(req, res, next){
//     var url_del = 'public' + req.body.url_del
//     console.log(url_del)
//     if(fs.existsSync(url_del)){
//       fs.unlinkSync(url_del)
//     }
//     res.redirect('back')
//   });
////////////////////////////////////////////////////


// File POST handler.
app.post('/e2/file_upload', function (req, res) {

  upload_file(req, function (err, data) {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }
    res.send(data);
  });
});

// Image POST handler.
app.post('/e2/image_upload', function (req, res) {

  upload_image(req, function (err, data) {

    if (err) {
      return res.status(404).end(JSON.stringify(err));
    }
    res.send(data);
  });
});


// Create folder for uploading files.
var filesDir = path.join(path.dirname(require.main.filename), 'public', 'uploads');
if (!fs.existsSync(filesDir)) {
  fs.mkdirSync(filesDir);
}



app.use(
  cookieSession({
    maxAge: 24 * 60 * 60 * 1000,
    keys: [keys.session.cookieKey]
    // keys: [process.env.COOKIE_KEY||keys.session.cookieKey],
  })
);
app.use((req, res, next) => {
  res.locals.message = req.session.message;
  delete req.session.message;
  next();
});

app.use(passport.initialize());
app.use(passport.session());
app.use(fileUpload());

connection.connect(function (err) {
  if (err) throw err;
  console.log("connected");
});

app.get("/", (req, res) => {
  res.redirect("/home");
});

app.get("/reviewer", (req, res) => {
  res.redirect("/auth/reviewer/login");
});

app.get("/panelforadmin", (req, res) => {
  res.redirect("/auth/panelforadmin/login");
});

app.use(compression());

app.use("/", navbarRouter);

app.use("/auth", authRouter);

app.use("/profile", profileRouter);

app.use("/home", homeRouter);

app.use("/", footerRouter);

app.use("/", ReviewArticlesRouter);

app.use("/", certiAuthRouter);

app.use("/intern", InternRouter);

app.use("/compose", contributeRouter);

app.use("/panelforadmin", adminRouter);

app.use("/submitForm", Submission);





app.use("/", (req, res) => {
  res.render("404");
});

app.listen(process.env.PORT||3000, () => {
  console.log("Server started on port 3000");
});



// site key:6Lf0e6YZAAAAALJpSNSGxYQoCZSX5ym5KUfyutDY
// secret key :6Lf0e6YZAAAAAIWvSxgV_mMeUCY-p24eh8gCRb_9