import escodegen from 'escodegen';
import { parseScript } from 'esprima';
import { BlockStatement, Directive, ModuleDeclaration, Statement } from 'estree';
import { clearAllInfiniteLoopChecks } from './detect';
import { detectInfiniteLoopObject, addBlockStatement } from './objects';

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
function checkObjectAndAddCheck(object: ASTNode): void {
    if (
        object.type == 'ForStatement' ||
        object.type == 'WhileStatement' ||
        object.type == 'DoWhileStatement'
    ) {
        currentId++;
        const { line, column } = object.loc!.start;
        const objectToAdd = detectInfiniteLoopObject(currentId, line, column);
        if (!Array.isArray((object.body as BlockStatement).body)) {
            let body = { ...object.body };
            object.body = addBlockStatement(body);
        }
        (object.body as BlockStatement).body.unshift(objectToAdd);
        return;
    }
    else if (object.type == 'IfStatement') {
        checkObjectAndAddCheck(object.consequent);
        if (object.alternate) {
            checkObjectAndAddCheck(object.alternate);
        }
    }
    else if (object.type == 'SwitchStatement') {
        for (const switchCase of object.cases) {
            for (const consequent of switchCase.consequent) {
                checkObjectAndAddCheck(consequent);
            }
        }
    }
    else if (Array.isArray((object as any).body)) {
        for (const node of (object as any).body) {
            checkObjectAndAddCheck(node);
        }
    }
}