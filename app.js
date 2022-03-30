var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require('cors')

/**
 * La razón de este require es porque tenía problemas al momento de utilizar la librería.
 * El archivo .env me devolvía datos undefined al momento de extraerlos de el mismo.
 */
require("dotenv").config();

/**
 * Implementacion de CORS
 */
 
 //extrae de las variables de entorno a CORS_ORIGIN que trae
 //consigo las URL que estaran en la whitelist
 var whiteList = (process.env.CORS_ORIGIN || '').split(',')
 console.log(whiteList)
 var corsOptions = {
     origin: (origin,callback)=>{
         console.log("Origin value: ",origin)
         if(whiteList.indexOf(origin) >= 0 ){
             callback(null,true)
         }else{
             callback(new Error('CORS not Allowed'))
         }
     }
 }


var indexRouter = require("./routes/index");
var apiRouter = require("./routes/api/api");

var app = express();

app.use(logger("dev"));
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/api", apiRouter);
// console.log(process.env);

module.exports = app;
