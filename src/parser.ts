import {Token, TokenType} from './lexer';

export class Node {}

export class Program extends Node {
  constructor(public readonly statements: StatementNode[]) {
    super();
  }
}

export class StatementNode extends Node {}

export class AssignStatementNode extends StatementNode {
  constructor(
    public readonly variable: VariableNode,
    public readonly expression: ExpressionNode,
  ) {
    super();
  }
}

export class PrintStatementNode extends StatementNode {
  constructor(public readonly variable: VariableNode) {
    super();
  }
}

export class IfStatementNode extends StatementNode {
  constructor(
    public readonly condition: ExpressionNode,
    public readonly thenStatements: StatementNode[],
    public readonly elseStatements: StatementNode[],
  ) {
    super();
  }
}

export class WhileStatementNode extends StatementNode {
  constructor(
    public readonly condition: ExpressionNode,
    public readonly doStatements: StatementNode[],
  ) {
    super();
  }
}

export class ExpressionNode extends Node {}

export class BinaryExpressionNode extends ExpressionNode {
  constructor(
    public readonly left: ExpressionNode,
    public readonly right: ExpressionNode,
  ) {
    super();
  }
}

export class AddNode extends BinaryExpressionNode {}

export class SubtractNode extends BinaryExpressionNode {}

export class NumberNode extends ExpressionNode {
  constructor(public readonly value: number) {
    super();
  }
}

export class VariableNode extends ExpressionNode {
  constructor(public readonly name: string) {
    super();
  }
}

class ParserError extends Error {}

export class Parser {
  tokens: Token[];
  tokenIndex: number;
  lineNumber: number;

  peek(): Token {
    return this.tokens[this.tokenIndex + 1];
  }

  expect(type: TokenType): Token {
    const token = this.peek();
    this.tokenIndex += 1;

    if (type === TokenType.EOL) {
      this.lineNumber += 1;
    }

    return token;
  }

  parseNumberOrVariable(): NumberNode | VariableNode {
    return
  }

  parseExpression(): ExpressionNode {
    return new ExpressionNode();
  }

  parseAssignStatement(): AssignStatementNode {
    this.expect(TokenType.ASSIGN);

    return new AssignStatementNode();
  }

  parsePrintStatement(): PrintStatementNode {
    const variableToken = this.expect(TokenType.ASSIGN);

    return new PrintStatementNode(new VariableNode(variableToken.value));
  }


  parseAssignOrPrintStatement(): AssignStatementNode | PrintStatementNode {
    const variableToken = this.expect(TokenType.IDENTIFIER);
    const variableNode = new VariableNode(variableToken.value);

    switch (this.peek().type) {
      case TokenType.ASSIGN:

      default:
        throw new ParserError('pöp');
    }


    const expression = this.parseExpression();

    return new AssignStatementNode(, expression);
  }

  parseIfStatement(): IfStatementNode {
    this.expect(TokenType.IF);

    this.expect(TokenType.END_IF);
  }

  parseWhileStatement(): WhileStatementNode {
    this.expect(TokenType.WHILE);

    this.expect(TokenType.END_WHILE);

    return new WhileStatementNode(condition, )
  }

  parseStatement(): StatementNode {
    let statement: StatementNode;

    const nextToken = this.peek();

    switch (nextToken.type) {
      case TokenType.EOL:
        break;

      case TokenType.EOF:
        break;

      case TokenType.IDENTIFIER:
        statement = this.parseAssignOrPrintStatement();
        break;

      case TokenType.IF:
        statement = this.parseIfStatement();
        break;

      case TokenType.WHILE:
        statement = this.parseWhileStatement();
        break;

      default:
        throw new ParserError(
          `Expected statement but got "${nextToken.value}" on line ${
            this.lineNumber
          }`,
        );
    }

    this.expect(TokenType.EOL);

    return statement;
  }

  parse(tokens: Token[]): Program {
    this.tokens = tokens;
    this.tokenIndex = 0;
    this.lineNumber = 1;

    let statements = [];

    while (this.tokenIndex < this.tokens.length) {
      statements = [...statements, this.parseStatement()];
    }

    return new Program(statements);
  }
}
