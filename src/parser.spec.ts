import {
  AssignStatementNode,
  NumberNode,
  Parser,
  Program,
  VariableNode,
} from './parser';
import { Token, TokenType } from './lexer';

test('parses', () => {
  const parser = new Parser();

  const tokens = [
    new Token(TokenType.IDENTIFIER, 'lassie'),
    new Token(TokenType.ASSIGN, 'AWOO'),
    new Token(TokenType.NUMBER, '5'),
    new Token(TokenType.EOL),
    new Token(TokenType.IDENTIFIER, 'luna'),
    new Token(TokenType.ASSIGN, 'AWOO'),
    new Token(TokenType.NUMBER, '6'),
    new Token(TokenType.EOL),
    new Token(TokenType.EOF),
  ];

  expect(parser.parse(tokens)).toStrictEqual(
    new Program([
      new AssignStatementNode(new VariableNode('lassie'), new NumberNode(5)),
      new AssignStatementNode(new VariableNode('luna'), new NumberNode(6)),
    ]),
  );
});
