import { Lexer } from './lexer';
import { Parser, Program, ParserError } from './parser';
import { VirtualMachine } from './virtual-machine';

export class Interpreter {
  constructor(
    private readonly lexer: Lexer,
    private readonly parser: Parser,
    private readonly virtualMachine: VirtualMachine,
  ) {}

  run(code: string): any {
    const tokens = this.lexer.tokenize(code);
    let program: Program;

    try {
      program = this.parser.parse(tokens);
    } catch (e) {
      if (e instanceof ParserError) {
        console.error(e.message);
        return 1;
      }

      throw e;
    }

    // Could do semantic analysis, code generation, optimization here if we wanted to.
    // As of now, we just attempt to execute the parsed syntax tree to keep it simple.

    return this.virtualMachine.execute(program);
  }
}
