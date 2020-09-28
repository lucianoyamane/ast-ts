const ts = require('typescript');

const testeNode = ts.createArrayLiteral(
    [ts.createObjectLiteral(
      [ts.createPropertyAssignment(
        ts.createIdentifier("attrObj"),
        ts.createObjectLiteral(
          [ts.createPropertyAssignment(
            ts.createIdentifier("id"),
            ts.createStringLiteral("attr_id")
          )],
          false
        )
      )],
      false
    )],
    false
  )
console.log(testeNode)

const resultFile = ts.createSourceFile('temp.ts', '', ts.ScriptTarget.Latest, false, ts.ScriptKind.TS);
const printer = ts.createPrinter({
    newLine: ts.NewLineKind.LineFeed
});
const result = printer.printNode(
    ts.EmitHint.Unspecified,
    testeNode,
    resultFile
);

console.log(result);