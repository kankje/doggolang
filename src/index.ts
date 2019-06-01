import fs from 'fs';
import { Interpreter } from './interpreter';
import { Lexer } from './lexer';
import { Parser } from './parser';
import { VirtualMachine } from './virtual-machine';

if (process.argv.length < 2) {
  console.info('Usage: node tokenIndex.js [filename]');
  process.exit(1);
}

const filename = process.argv[1];
let code;

try {
  code = fs.readFileSync(filename);
} catch (e) {
  console.error(`Unable to read ${filename}: ${e.message}`);
  process.exit(1);
}

const interpreter = new Interpreter(
  new Lexer(),
  new Parser(),
  new VirtualMachine(),
);

process.exit(interpreter.run(code));
