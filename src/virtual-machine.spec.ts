import {
  AssignStatementNode,
  FunctionCallNode,
  MultiplyNode,
  NumberNode,
  Program,
  VariableNode,
} from './parser';
import { VirtualMachine } from './virtual-machine';

test('parses', () => {
  const virtualMachine = new VirtualMachine({
    print: jest.fn(value => expect(value).toBe(15)),
  });

  const program = new Program([
    new AssignStatementNode(new VariableNode('lassie'), new NumberNode(5)),
    new AssignStatementNode(
      new VariableNode('luna'),
      new MultiplyNode(new VariableNode('lassie'), new NumberNode(3)),
    ),
    new FunctionCallNode('print', [new VariableNode('luna')]),
  ]);

  expect(virtualMachine.execute(program)).toBe(0);
});
