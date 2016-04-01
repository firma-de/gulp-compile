/// <reference path="./css.d.ts" />

var css = require("./css.css");

function alpha( css : string ) {
    css += "1";
}

alpha(css.root);