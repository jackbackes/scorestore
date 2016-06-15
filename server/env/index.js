'use strict';

var path = require('path');
// var devConfigPath = path.join(__dirname, './development.js');
var productionConfigPath = path.join(__dirname, './production.js');
// var testingConfigPath = path.join(__dirname, './testing.js');
let appVariables = {};

appVariables = require(productionConfigPath)

console.log('node environment:', process.env.NODE_ENV || 'development');
if(Object.keys(appVariables).length === 0) throw "don't forget to populate variables!";
module.exports = appVariables;
