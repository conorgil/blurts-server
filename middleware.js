"use strict";


const acceptLanguage = require("accept-language");

const mozlog = require("./log");


const log = mozlog("middleware");


function pickLanguage (req, res, next) {
  acceptLanguage.languages(req.app.locals.AVAILABLE_LANGUAGES);
  const pickedLanguage = acceptLanguage.get(req.headers["accept-language"]);
  req.pickedLanguage = pickedLanguage;
  const fluentBundle = req.app.locals.FLUENT_BUNDLES[pickedLanguage];
  req.fluentFormat = (message, args = null, errors = null) => {
    return fluentBundle.format(fluentBundle.getMessage(message, args));
  };
  next();
}


// Helps handle errors for all async route controllers
// See https://medium.com/@Abazhenov/using-async-await-in-express-with-node-8-b8af872c0016
function asyncMiddleware (fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}


function logErrors (err, req, res, next) {
  log.error("error", {stack: err.stack});
  next(err);
}


function clientErrorHandler (err, req, res, next) {
  if (req.xhr || req.headers["content-type"] === "application/json") {
    res.status(500).send({ message: err.message });
  } else {
    next(err);
  }
}


function errorHandler (err, req, res, next) {
  res.status(500);
  res.render("error", { message: err.message });
}


module.exports = {
  pickLanguage,
  asyncMiddleware,
  logErrors,
  clientErrorHandler,
  errorHandler,
};
