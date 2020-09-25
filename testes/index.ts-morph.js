var { Project } = require("ts-morph");

const project = new Project();
project.addSourceFilesAtPaths("**/*.ts");

const sourceFile = project.getSourceFileOrThrow("./my.component.ts");

const hasClasses = sourceFile.getClasses().length > 0;
const interfaces = sourceFile.getInterfaces();

// person interface
const personInterface = sourceFile.getClass("MyComponent");
console.log(personInterface.isDefaultExport()); // returns true
console.log(personInterface.getName()); // returns "Person"
console.log(personInterface.getProperties()); // returns the properties

const referencedSymbols = personInterface.findReferences();

for (const referencedSymbol of referencedSymbols) {
    for (const reference of referencedSymbol.getReferences()) {
        console.log("---------")
        console.log("REFERENCE")
        console.log("---------")
        console.log("File path: " + reference.getSourceFile().getFilePath());
        console.log("Start: " + reference.getTextSpan().getStart());
        console.log("Length: " + reference.getTextSpan().getLength());
        console.log("Parent kind: " + reference.getNode().getParentOrThrow().getKindName());
        console.log("\n");
    }
}
