const ts = require('typescript');


const testePropertyAcess = ts.createPropertyAccess(
                                ts.createPropertyAccess(
                                    ts.factory.createIdentifier("object"),
                                    ts.factory.createIdentifier("attrObj")
                                ),
                                ts.factory.createIdentifier("id")
                            );
console.log(testePropertyAcess)
