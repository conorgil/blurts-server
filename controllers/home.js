"use strict";

const TIPS = require("../tips");


function home(req, res) {
  let featuredBreach = null;
  let scanFeaturedBreach = false;
  if (req.query.breach) {
    const reqBreachName = req.query.breach.toLowerCase();
    featuredBreach = req.app.locals.breaches.filter(breach => breach.Name.toLowerCase() === reqBreachName)[0];
    scanFeaturedBreach = true;
  }
  // TODO: l10n
  res.render("monitor", {
    title: "Firefox Monitor",
    featuredBreach: featuredBreach,
    passwordTips: TIPS,
    scanFeaturedBreach,
  });
}


function notFound(req, res) {
  res.status(404);
  res.render("error", { message: req.fluentFormat("notFound") });
}

module.exports = {
  home,
  notFound,
};
