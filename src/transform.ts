import { parseScript, ParseOptions } from 'esprima';
import { Directive, Statement, ModuleDeclaration, BlockStatement } from 'estree';
import escodegen from 'escodegen';
import { clearAllInfiniteLoopChecks } from './detect';
import { detectInfiniteLoopObject } from './objects';

type ASTNode = Directive | Statement | ModuleDeclaration;

let currentId = 0;
export function addInfiniteLoopChecks(code: string): string {
    //reset
    currentId = 0;
    clearAllInfiniteLoopChecks();
    //add checks
    const AST = parseScript(code, {
        loc: true,
    });
    for (const node of AST.body) {
        checkObjectAndAddCheck(node);
    }
    return escodegen.generate(AST);
}
function checkObjectAndAddCheck(object: ASTNode) {
    if (
        object.type == 'ForStatement' ||
        object.type == 'WhileStatement' ||
        object.type == 'DoWhileStatement'
    ) {
        currentId++;
        const { line, column } = object.loc!.start;
        const objectToAdd = detectInfiniteLoopObject(currentId, line, column);
        console.log(objectToAdd);
        (object.body as BlockStatement).body.unshift(objectToAdd);
    }
}


const code = `while(true){console.log('test');}`;
console.log(addInfiniteLoopChecks(code));