import { Lexer, Token, TokenType } from './lexer';

test('tokenizes', () => {
  const lexer = new Lexer();

  expect(lexer.tokenize('lassie AWOO 5\n' + 'luna AWOO 6')).toStrictEqual([
    new Token(TokenType.IDENTIFIER, 'lassie'),
    new Token(TokenType.ASSIGN, 'AWOO'),
    new Token(TokenType.NUMBER, '5'),
    new Token(TokenType.EOL),
    new Token(TokenType.IDENTIFIER, 'luna'),
    new Token(TokenType.ASSIGN, 'AWOO'),
    new Token(TokenType.NUMBER, '6'),
    new Token(TokenType.EOL),
    new Token(TokenType.EOF),
  ]);
});
