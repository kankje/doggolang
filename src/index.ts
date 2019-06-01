import fs from 'fs';
import { Interpreter } from './interpreter';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { VirtualMachine } from './virtual-machine';
import { BUILT_IN_FUNCTIONS } from './built-in-functions';

if (process.argv.length < 3) {
  console.info('Usage: node dist/index.js <filename>');
  process.exit(1);
}

const filename = process.argv[2];
let code;

try {
  code = fs.readFileSync(filename).toString();
} catch (e) {
  console.error(`Unable to read ${filename}: ${e.message}`);
  process.exit(1);
}

const interpreter = new Interpreter(
  new Lexer(),
  new Parser(),
  new VirtualMachine(BUILT_IN_FUNCTIONS),
);

process.exit(interpreter.run(code));
