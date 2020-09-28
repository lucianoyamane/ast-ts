const ts = require('typescript');
const fs = require('fs');
const recast = require('recast');

// #####################TESTE RECAST
// let source = `
// import { Component } from '@angular/core';
// @Component({selector: 'my', template: 'hello me.' })
// export class MyComponent {}`;


// const tsAst = recast.parse(source, {
//     parser: require("recast/parsers/typescript")
//   });
// // console.log(tsAst);

// let classDeclaration = tsAst.program.body[1].declaration.id;

// classDeclaration.name = 'Mudei';

// console.log(recast.print(tsAst).code)





// const program = ts.createProgram(["my.component.ts"], {});

const node = ts.createSourceFile(
    'x.ts',`
      import { Component } from '@angular/core';
      @Component({selector: 'my', template: 'hello me.' })
      export class MyComponent {}`,
    ts.ScriptTarget.Latest
  );
  const thingImExtending = ts.factory.createIdentifier('BaseClass');
  // Get import info.
  var importDecl;
  node.forEachChild(child => {
    if (ts.SyntaxKind[child.kind] === 'ImportDeclaration') {
      importDecl = child;
    }
  });
  const importFiles = importDecl.importClause.namedBindings.elements.map(
    el => el.name.escapedText
  );
  const importLib = importDecl.moduleSpecifier.text;
  // Get decorator info.
  var classDecl;
  node.forEachChild(child => {
    if (ts.SyntaxKind[child.kind] === 'ClassDeclaration') {
      classDecl = child;
    }
  });
  const decoratorName = classDecl.decorators[0].expression.expression.escapedText;
  const decoratorParams = 
    classDecl.decorators[0].expression.arguments.reduce((acc, el) => {
      el.properties.forEach(
        prop => acc[prop.name.escapedText] = prop.initializer.text
      );
      return acc;
    }, {});
  // Get class name
  classDecl.name.escapedText = 'Mudei'
  const className =classDecl.name.escapedText
  console.log({
    importFiles,
    importLib,
    decoratorName,
    decoratorParams,
    className
  });

  const printer = ts.createPrinter();
  const newContent = printer.printFile(node)
  console.log(newContent)