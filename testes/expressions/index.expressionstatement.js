const ts = require('typescript');

const testeNode = ts.factory.createExpressionStatement(ts.factory.createCallExpression(
    ts.createPropertyAccess(
      ts.factory.createThis(),
      ts.factory.createIdentifier("funcao_teste")
    ),
    undefined,
    [ts.factory.createStringLiteral("atributo_teste")]
  ))
console.log(testeNode)