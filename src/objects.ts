import { IfStatement, BlockStatement, Statement } from 'estree';

export function addBlockStatement(obj: Statement): BlockStatement {
    return {
        type: 'BlockStatement',
        body: [
            obj,
        ]
    }
}

export function detectInfiniteLoopObject(id: number, line: number, column: number): IfStatement {
    return {
        type: "IfStatement",
        test: {
            type: "CallExpression",
            callee: {
                type: "MemberExpression",
                computed: false,
                object: {
                    type: "Identifier",
                    name: "window"
                },
                property: {
                    type: "Identifier",
                    name: "detectInfiniteLoop"
                }
            },
            arguments: [
                {
                    type: "Literal",
                    value: id
                }
            ]
        },
        consequent: {
            type: "BlockStatement",
            body: [
                {
                    type: "ThrowStatement",
                    argument: {
                        type: "ObjectExpression",
                        properties: [
                            {
                                type: "Property",
                                key: {
                                    type: "Identifier",
                                    name: "type"
                                },
                                computed: false,
                                value: {
                                    type: "Literal",
                                    value: "InfiniteLoopError",
                                    raw: "\"InfiniteLoopError\""
                                },
                                kind: "init",
                                method: false,
                                shorthand: false
                            },
                            {
                                type: "Property",
                                key: {
                                    type: "Identifier",
                                    name: "line"
                                },
                                computed: false,
                                value: {
                                    type: "Literal",
                                    value: line
                                },
                                kind: "init",
                                method: false,
                                shorthand: false
                            },
                            {
                                type: "Property",
                                key: {
                                    type: "Identifier",
                                    name: "column"
                                },
                                computed: false,
                                value: {
                                    type: "Literal",
                                    value: column
                                },
                                kind: "init",
                                method: false,
                                shorthand: false
                            }
                        ]
                    }
                }
            ]
        },
        alternate: null
    } as IfStatement;
}
/*
if (detectInfiniteLoop (id)) {
    throw {
        type: "InfiniteLoopError",
        line: line,
        column: col,
    }
}
*/