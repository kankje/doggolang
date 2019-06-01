import { Lexer } from './lexer';
import {
  Parser,
  ExpressionNode,
  StatementNode,
  PrintStatementNode,
  IfStatementNode,
  WhileStatementNode,
  AddNode,
  SubtractNode,
  NumberNode,
  VariableNode,
  Program,
  AssignStatementNode,
} from './parser';

interface Variables {
  [name: string]: number;
}

class ExecutionError extends Error {}

export class VirtualMachine {
  variables: Variables;

  evaluate(node: ExpressionNode): number {
    if (node instanceof AddNode) {
      return this.evaluate(node.left) + this.evaluate(node.right);
    }

    if (node instanceof SubtractNode) {
      return this.evaluate(node.left) - this.evaluate(node.right);
    }

    if (node instanceof NumberNode) {
      return node.value;
    }

    if (node instanceof VariableNode) {
      return this.variables[node.name];
    }

    throw new ExecutionError(`Unknown expression: ${JSON.stringify(node)}`);
  }

  runStatements(statements: StatementNode[]) {
    statements.forEach(node => {
      if (node instanceof AssignStatementNode) {
        this.variables[node.variable.name] = this.evaluate(node.expression);
        return;
      }

      if (node instanceof PrintStatementNode) {
        // TODO: Should probably extract this call somewhere to make it testable.
        console.info(this.variables[node.variable.name]);
        return;
      }

      if (node instanceof IfStatementNode) {
        if (this.evaluate(node.condition)) {
          this.runStatements(node.thenStatements);
        } else {
          this.runStatements(node.elseStatements);
        }
        return;
      }

      if (node instanceof WhileStatementNode) {
        while (this.evaluate(node.condition)) {
          this.runStatements(node.doStatements);
        }
        return;
      }

      throw new ExecutionError(`Unknown statement: ${JSON.stringify(node)}`);
    });
  }

  execute(program: Program): any {
    this.variables = {};

    try {
      this.runStatements(program.statements);
    } catch (e) {
      if (e instanceof ExecutionError) {
        console.error(e.message);
        return 1;
      }

      throw e;
    }

    return 0;
  }
}
