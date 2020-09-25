const fs = require('fs');
const ts = require('typescript');

// function makeFactorialFunction() {
//     const functionName = ts.createIdentifier("factorial");
//     const paramName = ts.createIdentifier("n");
//     const parameter = ts.createParameter(
//       /*decorators*/ undefined,
//       /*modifiers*/ undefined,
//       /*dotDotDotToken*/ undefined,
//       paramName
//     );
  
//     const condition = ts.createBinary(paramName, ts.SyntaxKind.LessThanEqualsToken, ts.createLiteral(1));
//     const ifBody = ts.createBlock([ts.createReturn(ts.createLiteral(1))], /*multiline*/ true);
  
//     const decrementedArg = ts.createBinary(paramName, ts.SyntaxKind.MinusToken, ts.createLiteral(1));
//     const recurse = ts.createBinary(paramName, ts.SyntaxKind.AsteriskToken, ts.createCall(functionName, /*typeArgs*/ undefined, [decrementedArg]));
//     const statements = [ts.createIf(condition, ifBody), ts.createReturn(recurse)];
  
//     return ts.createFunctionDeclaration(
//       /*decorators*/ undefined,
//       /*modifiers*/ [ts.createToken(ts.SyntaxKind.ExportKeyword)],
//       /*asteriskToken*/ undefined,
//       functionName,
//       /*typeParameters*/ undefined,
//       [parameter],
//       /*returnType*/ ts.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword),
//       ts.createBlock(statements, /*multiline*/ true)
//     );
//   }
  
//   const resultFile = ts.createSourceFile("someFileName.ts", "", ts.ScriptTarget.Latest, /*setParentNodes*/ false, ts.ScriptKind.TS);
//   const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  
//   const result = printer.printNode(ts.EmitHint.Unspecified, makeFactorialFunction(), resultFile);
//   console.log(result);

// function delint(sourceFile) {
//     delintNode(sourceFile);
  
//     function delintNode(node) {
//       switch (node.kind) {
//         case ts.SyntaxKind.ForStatement:
//         case ts.SyntaxKind.ForInStatement:
//         case ts.SyntaxKind.WhileStatement:
//         case ts.SyntaxKind.DoStatement:
//           if (node.statement.kind !== ts.SyntaxKind.Block) {
//             report(
//               node,
//               'A looping statement\'s contents should be wrapped in a block body.'
//             );
//           }
//           break;
  
//         case ts.SyntaxKind.IfStatement:
//           const ifStatement = node;
//           if (ifStatement.thenStatement.kind !== ts.SyntaxKind.Block) {
//             report(ifStatement.thenStatement, 'An if statement\'s contents should be wrapped in a block body.');
//           }
//           if (
//             ifStatement.elseStatement &&
//             ifStatement.elseStatement.kind !== ts.SyntaxKind.Block &&
//             ifStatement.elseStatement.kind !== ts.SyntaxKind.IfStatement
//           ) {
//             report(
//               ifStatement.elseStatement,
//               'An else statement\'s contents should be wrapped in a block body.'
//             );
//           }
//           break;
  
//         case ts.SyntaxKind.BinaryExpression:
//           const op = node.operatorToken.kind;
//           if (op === ts.SyntaxKind.EqualsEqualsToken || op === ts.SyntaxKind.ExclamationEqualsToken) {
//             report(node, 'Use \'===\' and \'!==\'.');
//           }
//           break;
//       }
  
//       ts.forEachChild(node, delintNode);
//     }
  
//     function report(node, message) {
//       const { line, character } = sourceFile.getLineAndCharacterOfPosition(node.getStart());
//       console.log(`${sourceFile.fileName} (${line + 1},${character + 1}): ${message}`);
//     }
//   }
  
//   const fileNames = process.argv.slice(2);
//   fileNames.forEach(fileName => {
//     // Parse a file
//     const sourceFile = ts.createSourceFile(
//       fileName,
//       fs.readFileSync(fileName).toString(),
//       ts.ScriptTarget.ES2015,
//       /*setParentNodes */ true
//     );
  
//     // delint it
//     delint(sourceFile);
//   });

// const source = "let x: string  = 'string'";

// let result = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS }});

// console.log(JSON.stringify(result));

// function compile(fileNames, options) {
//   let program = ts.createProgram(fileNames, options);
//   let emitResult = program.emit();

//   let allDiagnostics = ts
//     .getPreEmitDiagnostics(program)
//     .concat(emitResult.diagnostics);

//   allDiagnostics.forEach(diagnostic => {
//     if (diagnostic.file) {
//         if (diagnostic.start) {
//             let { line, character } = diagnostic.file.getLineAndCharacterOfPosition(diagnostic.start);
//             let message = ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n");
//             console.log(`${diagnostic.file.fileName} (${line + 1},${character + 1}): ${message}`);
//         }
      
//     } else {
//       console.log(ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"));
//     }
//   });

//   let exitCode = emitResult.emitSkipped ? 1 : 0;
//   console.log(`Process exiting with code '${exitCode}'.`);
//   process.exit(exitCode);
// }

// let files = [process.argv.slice(2)]

// compile(process.argv.slice(2), {
//   noEmitOnError: true,
//   noImplicitAny: true,
//   experimentalDecorators: true,
//   target: ts.ScriptTarget.ES5,
//   module: ts.ModuleKind.CommonJS
// });

  
  /** Generate documentation for all classes in a set of .ts files */
  function generateDocumentation(
    fileNames,
    options
  ) {
    // Build a program using the set of root file names in fileNames
    let program = ts.createProgram(fileNames, options);
  
    // Get the checker, we will use it to find more about classes
    let checker = program.getTypeChecker();
    let output = [];
  
    // Visit every sourceFile in the program
    for (const sourceFile of program.getSourceFiles()) {
      if (!sourceFile.isDeclarationFile) {
        // Walk the tree to search for classes
        ts.forEachChild(sourceFile, visit);
      }
    }
  
    // print out the doc
    fs.writeFileSync("classes.json", JSON.stringify(output, undefined, 4));
  
    return;
  
    /** visit nodes finding exported classes */
    function visit(node) {
      // Only consider exported nodes
      if (!isNodeExported(node)) {
        return;
      }
  
      if (ts.isClassDeclaration(node) && node.name) {
        // This is a top level class, get its symbol
        let symbol = checker.getSymbolAtLocation(node.name);
        if (symbol) {
          output.push(serializeClass(symbol));
        }
        // No need to walk any further, class expressions/inner declarations
        // cannot be exported
      } else if (ts.isModuleDeclaration(node)) {
        // This is a namespace, visit its children
        ts.forEachChild(node, visit);
      }
    }
  
    /** Serialize a symbol into a json object */
    function serializeSymbol(symbol) {
      return {
        name: symbol.getName(),
        documentation: ts.displayPartsToString(symbol.getDocumentationComment(checker)),
        type: checker.typeToString(
          checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration)
        )
      };
    }
  
    /** Serialize a class symbol information */
    function serializeClass(symbol) {
      let details = serializeSymbol(symbol);
  
      // Get the construct signatures
      let constructorType = checker.getTypeOfSymbolAtLocation(
        symbol,
        symbol.valueDeclaration
      );
      details.constructors = constructorType
        .getConstructSignatures()
        .map(serializeSignature);
      return details;
    }
  
    /** Serialize a signature (call or construct) */
    function serializeSignature(signature) {
      return {
        parameters: signature.parameters.map(serializeSymbol),
        returnType: checker.typeToString(signature.getReturnType()),
        documentation: ts.displayPartsToString(signature.getDocumentationComment(checker))
      };
    }
  
    /** True if this is visible outside this file, false otherwise */
    function isNodeExported(node) {
      return (
        (ts.getCombinedModifierFlags(node) & ts.ModifierFlags.Export) !== 0 ||
        (!!node.parent && node.parent.kind === ts.SyntaxKind.SourceFile)
      );
    }
  }
  
  generateDocumentation(process.argv.slice(2), {
    target: ts.ScriptTarget.ES5,
    module: ts.ModuleKind.CommonJS
  });