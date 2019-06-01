import {
  ExpressionNode,
  StatementNode,
  FunctionCallNode,
  IfStatementNode,
  WhileStatementNode,
  AddNode,
  SubtractNode,
  NumberNode,
  VariableNode,
  Program,
  AssignStatementNode,
  MultiplyNode,
  LessThanNode,
  GreaterThanNode,
} from './parser';

interface Variables {
  [name: string]: number;
}

class ExecutionError extends Error {}

interface BuiltInFunctions {
  [name: string]: Function;
}

export class VirtualMachine {
  private variables: Variables;

  constructor(private readonly builtInFunctions: BuiltInFunctions) {}

  public execute(program: Program): any {
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

  private evaluate(node: ExpressionNode): number {
    if (node instanceof AddNode) {
      return this.evaluate(node.left) + this.evaluate(node.right);
    }

    if (node instanceof SubtractNode) {
      return this.evaluate(node.left) - this.evaluate(node.right);
    }

    if (node instanceof MultiplyNode) {
      return this.evaluate(node.left) * this.evaluate(node.right);
    }

    if (node instanceof LessThanNode) {
      return this.evaluate(node.left) < this.evaluate(node.right) ? 1 : 0;
    }

    if (node instanceof GreaterThanNode) {
      return this.evaluate(node.left) > this.evaluate(node.right) ? 1 : 0;
    }

    if (node instanceof NumberNode) {
      return node.value;
    }

    if (node instanceof VariableNode) {
      return this.variables[node.name];
    }

    throw new ExecutionError(`Unknown expression: ${JSON.stringify(node)}`);
  }

  private runStatements(statements: StatementNode[]) {
    statements.forEach(node => {
      if (node instanceof AssignStatementNode) {
        this.variables[node.variable.name] = this.evaluate(node.expression);
        return;
      }

      if (node instanceof FunctionCallNode) {
        this.builtInFunctions[node.name](
          ...node.args.map(arg => this.evaluate(arg)),
        );
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
}
