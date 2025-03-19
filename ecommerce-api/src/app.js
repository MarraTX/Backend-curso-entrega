const express = require("express");
const handlebars = require("express-handlebars");
const app = express();

const hbs = handlebars.create({
  helpers: {
    eq: function (a, b) {
      return a === b;
    },
  },
});

// Configurar el motor de vistas
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
