var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");

/**
 * La razón de este require es porque tenía problemas al momento de utilizar la librería.
 * El archivo .env me devolvía datos undefined al momento de extraerlos de el mismo.
 */
require("dotenv").config();

var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api/api");

var app = express();

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", apiRouter);
// console.log(process.env);

module.exports = app;
