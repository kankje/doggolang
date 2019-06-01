import { Lexer } from './lexer';
import { Parser } from './parser';
import { VirtualMachine } from './virtual-machine';

export class Interpreter {
  constructor(
    private readonly lexer: Lexer,
    private readonly parser: Parser,
    private readonly virtualMachine: VirtualMachine,
  ) {}

  run(code: string): any {
    const tokens = this.lexer.tokenize(code);
    const program = this.parser.parse(tokens);

    // Could do semantic analysis, code generation, optimization here if we wanted to.
    // As of now, we just attempt to execute the parsed syntax tree to keep it simple.

    return this.virtualMachine.execute(program);
  }
}
