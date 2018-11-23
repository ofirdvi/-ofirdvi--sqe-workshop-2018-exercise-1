import assert from 'assert';
import {parseCode} from '../src/js/code-analyzer';

describe('The javascript parser', () => {
    it('is parsing an empty function correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('')),
            '[]'
        );
    });

    it('is parsing a simple variable declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('let a = 1;')),
            '[{"Line":1,"Type":"VariableDeclarator","Name":"a","Cond":"","Value":""}]'
        );
    });

    it('is parsing a simple function declaration correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(){}')),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"binarySearch","Cond":"","Value":""}]'
        );
    });


    it('is parsing a simple function declaration with params correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function binarySearch(X, V, n){}')),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"binarySearch","Cond":"","Value":""},{"Line":1,"Type":"Param","Name":"X","Cond":"","Value":""},{"Line":1,"Type":"Param","Name":"V","Cond":"","Value":""},{"Line":1,"Type":"Param","Name":"n","Cond":"","Value":""}]'
        );
    });

    it('is parsing a simple assignment expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('low = 0;')),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"low","Cond":"","Value":0}]'
        );
    });

    it('is parsing a assignment expression with right side as unary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('low = -1;')),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"low","Cond":"","Value":"-1"}]'
        );
    });

    it('is parsing a simple assignment expression with left side as member expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('V[m] = 3;')),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"V[m]","Cond":"","Value":3}]'
        );
    });

    it('is parsing a assignment expression with right side as binary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('high = n - 1;')),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"high","Cond":"","Value":"n - 1"}]'
        );
    });

    it('is parsing a binary expression with right side as binary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('high = n + ( m + 1 );')),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"high","Cond":"","Value":"n + m + 1"}]'
        );
    });

    it('is parsing a binary expression with right side as member expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('high = n + V[m];')),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"high","Cond":"","Value":"n + V[m]"}]'
        );
    });

    it('is parsing a binary expression with right side as identifier correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('high = n + n;')),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"high","Cond":"","Value":"n + n"}]'
        );
    });

    it('is parsing a binary expression with left side as Literal correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('high = 1 + n;')),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"high","Cond":"","Value":"1 + n"}]'
        );
    });

    it('is parsing a binary expression with left side as Member expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('n = v[n] + m;')),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"n","Cond":"","Value":"v[n] + m"}]'
        );
    });

    it('is parsing a simple assignment expression with left side as member expression that contain binary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('V[m + 1] = 3;')),
            '[{"Line":1,"Type":"AssignmentExpression","Name":"V[m + 1]","Cond":"","Value":3}]'
        );
    });

    it('is parsing a simple while statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('while (low>0) {}')),
            '[{"Line":1,"Type":"WhileStatement","Name":"","Cond":"low > 0","Value":""}]'
        );
    });

    it('is parsing a while statement  with cond that contain binary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('while ((low+1)>0) {}')),
            '[{"Line":1,"Type":"WhileStatement","Name":"","Cond":"low + 1 > 0","Value":""}]'
        );
    });

    it('is parsing a simple if statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('if (x>1){}')),
            '[{"Line":1,"Type":"IfStatement","Name":"","Cond":"x > 1","Value":""}]'
        );
    });

    it('is parsing function with a simple return statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function x(){\n' + 'return mid\n' + '}')),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"x","Cond":"","Value":""},{"Line":2,"Type":"ReturnStatement","Name":"","Cond":"","Value":"mid"}]'
        );
    });

    it('is parsing function with a return statement that contain unary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function x(){\n' + 'return -1\n' + '}')),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"x","Cond":"","Value":""},{"Line":2,"Type":"ReturnStatement","Name":"","Cond":"","Value":"-1"}]'
        );
    });

    it('is parsing function with with IfElse statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function x(){\n' + 'if (X < 1)\n' + 'high = 1;\n'+ 'else if (X > 1)\n' + 'low = 1;\n' + 'else\n' +  'return mid;\n' + '}')),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"x","Cond":"","Value":""},{"Line":2,"Type":"IfStatement","Name":"","Cond":"X < 1","Value":""},{"Line":3,"Type":"AssignmentExpression","Name":"high","Cond":"","Value":1},{"Line":4,"Type":"IfElseStatement","Name":"","Cond":"X > 1","Value":""},{"Line":5,"Type":"AssignmentExpression","Name":"low","Cond":"","Value":1},{"Line":7,"Type":"ReturnStatement","Name":"","Cond":"","Value":"mid"}]'
        );
    });

    it('is parsing function with with for statement correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function x(){\n' + 'for (var i = 0; i >= 1 ; i++){\n' + 'mid = mid+1;\n'+ '}\n' + '}')),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"x","Cond":"","Value":""},{"Line":2,"Type":"VariableDeclarator","Name":"i","Cond":"","Value":""},{"Line":2,"Type":"ForStatement","Name":"i; i >= 1; i++;","Cond":"","Value":""},{"Line":3,"Type":"AssignmentExpression","Name":"mid","Cond":"","Value":"mid + 1"}]'
        );
    });

    it('is parsing function with with for statement where update is essignment expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('function x(){\n' + 'for (var i = 0; i >= 1 ; i=1+1){\n' + 'mid = mid+1;\n'+ '}\n' + '}')),
            '[{"Line":1,"Type":"FunctionDeclaration","Name":"x","Cond":"","Value":""},{"Line":2,"Type":"VariableDeclarator","Name":"i","Cond":"","Value":""},{"Line":2,"Type":"ForStatement","Name":"i; i >= 1; i = 1 + 1;","Cond":"","Value":""},{"Line":3,"Type":"AssignmentExpression","Name":"mid","Cond":"","Value":"mid + 1"}]'
        );
    });

    it('is parsing for statement with update that contain binary expression correctly', () => {
        assert.equal(
            JSON.stringify(parseCode('for (var i = 0; i >= n + 1 ; i=1+1){}')),
            '[{"Line":1,"Type":"VariableDeclarator","Name":"i","Cond":"","Value":""},{"Line":1,"Type":"ForStatement","Name":"i; i >= n + 1; i = 1 + 1;","Cond":"","Value":""}]'
        );
    });
});
