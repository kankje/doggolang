export enum TokenType {
  EOF,
  EOL,

  NUMBER,
  IDENTIFIER,

  ASSIGN,
  ADD,
  SUBTRACT,
  MULTIPLY,
  LESS_THAN,
  MORE_THAN,

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

export function translateTokenType(type: TokenType): string {
  const translations = {
    [TokenType.EOF]: 'end of file',
    [TokenType.EOL]: 'end of line',

    [TokenType.NUMBER]: 'number',
    [TokenType.IDENTIFIER]: 'identifier',

    [TokenType.ASSIGN]: 'AWOO',
    [TokenType.ADD]: 'WOOF',
    [TokenType.SUBTRACT]: 'BARK',
    [TokenType.MULTIPLY]: 'ARF',
    [TokenType.LESS_THAN]: 'YIP',
    [TokenType.MORE_THAN]: 'YAP',

    [TokenType.IF]: 'RUF?',
    [TokenType.THEN]: 'VUH',
    [TokenType.ELSE]: 'ROWH',
    [TokenType.END_IF]: 'ARRUF',

    [TokenType.WHILE]: 'GRRR',
    [TokenType.DO]: 'BOW',
    [TokenType.END_WHILE]: 'BORF',
  };

  return translations[type];
}

export class Lexer {
  public tokenize(code: string): Token[] {
    const tokenizedLines = code
      .split('\n')
      .map(line => [
        ...this.tokenizeLine(line),
        new Token(TokenType.EOL, 'end of line'),
      ]);
    const flattenedTokens = [].concat(...tokenizedLines);

    return [...flattenedTokens, new Token(TokenType.EOF, 'end of file')];
  }

  private tokenizeLine(line: string): Token[] {
    return line
      .split(' ')
      .filter(word => word.length > 0)
      .map(word => this.tokenizeWord(word));
  }

  private tokenizeWord(word: string) {
    const keywordMap = {
      AWOO: TokenType.ASSIGN,
      WOOF: TokenType.ADD,
      BARK: TokenType.SUBTRACT,
      ARF: TokenType.MULTIPLY,
      YIP: TokenType.LESS_THAN,
      YAP: TokenType.MORE_THAN,

      'RUF?': TokenType.IF,
      VUH: TokenType.THEN,
      ROWH: TokenType.ELSE,
      ARRUF: TokenType.END_IF,

      GRRR: TokenType.WHILE,
      BOW: TokenType.DO,
      BORF: TokenType.END_WHILE,
    };

    if (/^\d+$/.test(word)) {
      return new Token(TokenType.NUMBER, word);
    }

    if (keywordMap[word]) {
      return new Token(keywordMap[word], word);
    }

    return new Token(TokenType.IDENTIFIER, word);
  }
}
