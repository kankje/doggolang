import { Token, TokenType, translateTokenType } from './lexer';

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

export class FunctionCallNode extends StatementNode {
  constructor(public readonly name, public readonly args: ExpressionNode[]) {
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

export class MultiplyNode extends BinaryExpressionNode {}

export class LessThanNode extends BinaryExpressionNode {}

export class GreaterThanNode extends BinaryExpressionNode {}

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

export class ParserError extends Error {
  constructor(message?: string, lineNumber?: number) {
    if (lineNumber) {
      super(`${message} on line ${lineNumber}`);
      return;
    }

    super(message);
  }
}

export class Parser {
  tokens: Token[];
  tokenIndex: number;
  lineNumber: number;

  public parse(tokens: Token[]): Program {
    this.tokens = tokens;
    this.tokenIndex = 0;
    this.lineNumber = 1;

    let statements = [];

    while (this.peek().type !== TokenType.EOF) {
      if (this.skipEmptyLines()) {
        continue;
      }

      statements = [...statements, this.parseStatement()];
    }

    return new Program(statements);
  }

  private createError(message: string) {
    return new ParserError(message, this.lineNumber);
  }

  private peek(): Token {
    return this.tokens[this.tokenIndex];
  }

  private accept(type: TokenType): Token | null {
    if (this.tokenIndex >= this.tokens.length) {
      return null;
    }

    if (this.tokens[this.tokenIndex].type !== type) {
      return null;
    }

    const token = this.tokens[this.tokenIndex];
    this.tokenIndex += 1;

    if (token.type === TokenType.EOL) {
      this.lineNumber += 1;
    }

    return token;
  }

  private expect(type: TokenType): Token {
    const token = this.accept(type);

    if (!token) {
      throw this.createError(
        `Expected ${translateTokenType(type)} but got ${this.tokens[this.tokenIndex].value}`,
      );
    }

    return token;
  }

  private skipEmptyLines(): boolean {
    let found = false;

    while (this.accept(TokenType.EOL)) {
      found = true;
    }

    return found;
  }

  private parseNumber(): NumberNode {
    const numberToken = this.expect(TokenType.NUMBER);

    return new NumberNode(parseInt(numberToken.value, 10));
  }

  private parseVariable(): VariableNode {
    const variableToken = this.expect(TokenType.IDENTIFIER);

    return new VariableNode(variableToken.value);
  }

  private parseTerm(): ExpressionNode {
    if (this.peek().type === TokenType.NUMBER) {
      return this.parseNumber();
    }

    return this.parseVariable();
  }

  private parseMultiplication(): ExpressionNode {
    // No support for unary expressions.
    const left = this.parseTerm();

    if (this.accept(TokenType.MULTIPLY)) {
      const right = this.parseTerm();

      return new MultiplyNode(left, right);
    }

    return left;
  }

  private parseAddition(): ExpressionNode {
    const left = this.parseMultiplication();

    if (this.accept(TokenType.ADD)) {
      const right = this.parseMultiplication();

      return new AddNode(left, right);
    }

    if (this.accept(TokenType.SUBTRACT)) {
      const right = this.parseMultiplication();

      return new SubtractNode(left, right);
    }

    return left;
  }

  private parseCondition(): ExpressionNode {
    const left = this.parseAddition();

    if (this.accept(TokenType.LESS_THAN)) {
      const right = this.parseAddition();

      return new LessThanNode(left, right);
    }

    if (this.accept(TokenType.MORE_THAN)) {
      const right = this.parseAddition();

      return new GreaterThanNode(left, right);
    }

    return left;
  }

  private parseExpression(): ExpressionNode {
    return this.parseCondition();
  }

  private parseAssignOrPrintStatement():
    | AssignStatementNode
    | FunctionCallNode {
    const variable = this.parseVariable();

    if (this.accept(TokenType.ASSIGN)) {
      const expression = this.parseExpression();

      return new AssignStatementNode(variable, expression);
    }

    return new FunctionCallNode('print', [variable]);
  }

  private parseIfStatement(): IfStatementNode {
    this.expect(TokenType.IF);

    const condition = this.parseExpression();

    this.expect(TokenType.THEN);

    let thenStatements = [];
    let elseStatements = [];
    let isThen = true;

    while (!this.accept(TokenType.END_IF)) {
      if (this.skipEmptyLines()) {
        continue;
      }

      if (this.accept(TokenType.ELSE)) {
        isThen = false;
        continue;
      }

      if (isThen) {
        thenStatements = [...thenStatements, this.parseStatement()];
      } else {
        elseStatements = [...elseStatements, this.parseStatement()];
      }
    }

    return new IfStatementNode(condition, thenStatements, elseStatements);
  }

  private parseWhileStatement(): WhileStatementNode {
    this.expect(TokenType.WHILE);

    const condition = this.parseExpression();

    this.expect(TokenType.DO);

    let doStatements = [];

    while (!this.accept(TokenType.END_WHILE)) {
      if (this.skipEmptyLines()) {
        continue;
      }

      doStatements = [...doStatements, this.parseStatement()];
    }

    return new WhileStatementNode(condition, doStatements);
  }

  private parseStatement(): StatementNode | null {
    const token = this.peek();

    switch (token.type) {
      case TokenType.NUMBER:
      case TokenType.IDENTIFIER:
        return this.parseAssignOrPrintStatement();

      case TokenType.IF:
        return this.parseIfStatement();

      case TokenType.WHILE:
        return this.parseWhileStatement();

      default:
        throw this.createError(`Expected statement but got ${token.value}`);
    }
  }
}
