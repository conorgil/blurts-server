"use strict";

const fs = require("fs");
const path = require("path");

const { FluentBundle } = require("fluent");

const mozlog = require("./log");


const log = mozlog("middleware");

const localesDir = path.join("public", "locales");


function loadLanguagesIntoApp (app) {
  const languageDirectories = fs.readdirSync( localesDir ).filter(item => {
    return (item[0] !== "." && item.length === 2)
  });
  const availableLanguages = [];
  const fluentBundles = {};
  for (const lang of languageDirectories) {
    try {
      const langBundle = new FluentBundle(lang);
      const langFTLSource = fs.readFileSync(path.join(localesDir, lang, "app.ftl"), "utf8");
      langBundle.addMessages(langFTLSource);
      fluentBundles[lang] = langBundle;
      availableLanguages.push(lang);
    } catch (e) {
      log.error("loadFluentBundle", {stack: e.stack});
    }
  }
  app.locals.AVAILABLE_LANGUAGES = availableLanguages;
  app.locals.FLUENT_BUNDLES = fluentBundles;
}


module.exports = {
  loadLanguagesIntoApp,
};
