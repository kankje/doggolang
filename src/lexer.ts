export enum TokenType {
  EOF,
  EOL,

  NUMBER,
  IDENTIFIER,

  ASSIGN,
  OPERATOR,

  IF,
  THEN,
  ELSE,
  END_IF,

  WHILE,
  DO,
  END_WHILE,
}

export class Token {
  constructor(
    public readonly type: TokenType,
    public readonly value?: string,
  ) {}
}

export class Lexer {
  tokenizeLine(line: string): Token[] {
    const operatorMap = {
      BARK: '+',
      WOOF: '-',
      YIP: '<',
      YAP: '>',
    };

    const keywordMap = {
      AWOO: TokenType.ASSIGN,
      'RUF?': TokenType.IF,
      VUH: TokenType.THEN,
      ROWH: TokenType.ELSE,
      ARRUF: TokenType.END_IF,
      GRRR: TokenType.WHILE,
      BOW: TokenType.DO,
      BORF: TokenType.END_WHILE,
    };

    return line
      .split(' ')
      .filter(raw => raw.length > 0)
      .map(raw => {
        if (/^\d+$/.test(raw)) {
          return new Token(TokenType.NUMBER, raw);
        }

        if (operatorMap[raw]) {
          return new Token(TokenType.OPERATOR, raw);
        }

        if (keywordMap[raw]) {
          return new Token(keywordMap[raw], raw);
        }

        return new Token(TokenType.IDENTIFIER, raw);
      });
  }

  tokenize(code: string): Token[] {
    const tokenizedLines = code
      .split('\n')
      .map(line => [...this.tokenizeLine(line), new Token(TokenType.EOL)]);
    const flattenedTokens = [].concat(...tokenizedLines);

    return [...flattenedTokens, new Token(TokenType.EOF)];
  }
}
