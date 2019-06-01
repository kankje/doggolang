import { Lexer, Token, TokenType } from './lexer';
import { Interpreter } from './interpreter';
import { Parser } from './parser';
import { VirtualMachine } from './virtual-machine';

const code = `samantha AWOO 1
hooch AWOO 500
einstein AWOO 10
fuji AWOO 0
GRRR fuji YIP hooch BOW
    samantha AWOO samantha WOOF 3
    RUF? samantha YAP 100 VUH
      samantha AWOO samantha BARK 1
    ROWH
      einstein AWOO einstein WOOF 1
      samantha AWOO samantha ARF einstein
    ARRUF
    fuji AWOO fuji WOOF 1
BORF
GRRR fuji YAP 0 BOW
    samantha AWOO samantha WOOF 375
    fuji AWOO fuji BARK 3
BORF
samantha`;

test('interprets', () => {
  const interpreter = new Interpreter(
    new Lexer(),
    new Parser(),
    new VirtualMachine({ print: jest.fn(value => expect(value).toBe(64185)) }),
  );

  expect(interpreter.run(code)).toBe(0);
});
