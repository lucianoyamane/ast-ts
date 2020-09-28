const ts = require('typescript');

const testeidentifier = ts.factory.createStringLiteral('testeLiteral');
console.log(testeidentifier)

const testeidentifierSingleQuote = ts.factory.createStringLiteral('testeLiteral', true);
console.log(testeidentifierSingleQuote)