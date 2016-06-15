'use strict';

var path = require('path');
// var devConfigPath = path.join(__dirname, './development.js');
var productionConfigPath = path.join(__dirname, './production.js');
// var testingConfigPath = path.join(__dirname, './testing.js');
let appVariables = {};

process.env.NODE_ENV = "production";
if (process.env.NODE_ENV === 'production') {
    appVariables = require(productionConfigPath)
} 
// else if (process.env.NODE_ENV === 'testing') {
//     appVariables = require(testingConfigPath);
// } else {
//     appVariables = require(devConfigPath);
// }

console.log('node environment:', process.env.NODE_ENV || 'development');
if(Object.keys(appVariables).length === 0) throw "don't forget to populate variables!";
module.exports = appVariables;
