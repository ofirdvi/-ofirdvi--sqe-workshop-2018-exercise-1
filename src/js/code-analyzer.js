import * as esprima from 'esprima';
/*TODO*/

/*
* IfElseStatment
* binaryExpression with left side as literal
* ForStatment
* Function exsepssion
*
* */
var parsedNodesData = [];
const parseCode = (codeToParse) => {
    /*
    let parsed  = esprima.parseScript(codeToParse,{loc: true}, function(node, metadata){
        console.log(metadata.start.line, node.type, node.name, node.value, node.params, node.right); // eslint-disable-line no-console
    });
    */
    parsedNodesData = [];
    esprima.parseScript(codeToParse,{loc: true}, function(node,metadata){
        if (node.type === 'FunctionDeclaration'){ parseFunctionDeclaration(node,metadata);}
        if(node.type ==='VariableDeclaration'){ parseVariableDeclaration(node, metadata);}
        if (node.type === 'ExpressionStatement') { parseExpressionStatement(node,metadata);}
        else{
            mainParseFunction(node,metadata);
        }
    });
    parsedNodesData.sort((a, b) => Number(a.Line) - Number(b.Line));
    return parsedNodesData;
};

function mainParseFunction(node,metadata){
    if (node.type === 'WhileStatement') { parseWhileStatement(node,metadata);}
    if(node.type === 'IfStatement'){ parseIfStatement(node,'IfStatement',metadata.start.line);}
    if(node.type === 'ForStatement'){ parseForStatement(node,metadata);}
    if(node.type === 'ReturnStatement'){ parseReturnStatement(node,metadata);}
}

function parseFunctionDeclaration(node,metadata){
    parsedNodesData.push({ Line: metadata.start.line, Type: node.type, Name: node.id.name ,Cond:'', Value: ''});
    parseParam(node,metadata);

}

function parseParam(node,metadata){
    for (var i in node.params) {
        parsedNodesData.push({ Line: metadata.start.line, Type: 'Param', Name: node.params[i].name ,Cond:'', Value: ''});
    }
}

function parseVariableDeclaration(node,metadata){
    for (var i in node.declarations) {
        parsedNodesData.push({ Line: metadata.start.line, Type: node.declarations[i].type, Name: node.declarations[i].id.name ,Cond:'', Value: ''});
    }
}

function parseExpressionStatement(node,metadata) {
    var value;
    var name;
    if(node.expression.left.type === 'MemberExpression'){
        name = parseMemberExpression(node.expression.left);}
    else{
        name = node.expression.left.name;}
    if(node.expression.right.type === 'BinaryExpression'){
        value = parseBinaryExpression(node.expression.right);
    }
    else if(node.expression.right.type === 'UnaryExpression'){
        value = parseUnaryExpression(node.expression.right);
    }
    else{
        value = node.expression.right.value;
    }
    parsedNodesData.push({  Line: metadata.start.line, Type: node.expression.type, Name: name,Cond:'', Value:value});
}

function parseBinaryExpression(node){
    var operator = node.operator;
    var left,right;
    left = parseLeftBinaryExpression(node.left);
    right = parseRightBinaryExpression(node.right);
    return left + ' ' + operator + ' ' + right;
}

function parseLeftBinaryExpression(node){
    var left;
    if (node.type === 'BinaryExpression'){left = parseBinaryExpression(node);}
    if (node.type === 'Literal'){ left = node.value;}
    if (node.type === 'MemberExpression'){ left = parseMemberExpression(node);}
    if (node.type === 'Identifier'){left = node.name;}
    return left;
}

function parseRightBinaryExpression(node){
    var right;
    if (node.type === 'BinaryExpression'){ right = parseBinaryExpression(node);}
    if (node.type === 'MemberExpression') { right = parseMemberExpression(node);}
    if (node.type === 'Identifier'){ right = node.name;}
    if(node.type === 'Literal'){ right = node.value;}
    return right;
}

function  parseForStatement(node,metadata){
    var update ,test, init;
    for(var i in node.init.declarations){
        console.log('here'); // eslint-disable-line no-console
        console.log(node.init.declarations[i].id.name, node.init.declarations[i].init.value); // eslint-disable-line no-console
        init = node.init.declarations[i].id.name; //+ '=' + node.init.declarations[i].init.value;
    }
    if(node.update.type ==='UpdateExpression'){ update  = parseUpdateExpression(node.update); }
    else if (node.update.type ==='AssignmentExpression'){
        console.log('node.update.type === AssignmentExpression'); // eslint-disable-line no-console
        update = parseBinaryExpression(node.update);}
    if (node.test.type ==='BinaryExpression'){
        console.log('node.update.type === BinaryExpression'); // eslint-disable-line no-console
        test = parseBinaryExpression(node.test);}
    var _cond  = init + '; ' + test + '; ' + update + ';';
    parsedNodesData.push({  Line: metadata.start.line, Type: node.type, Name: _cond,Cond:'', Value:''});
}

function parseUpdateExpression(node){
    return  node.argument.name + node.operator;
}

function parseWhileStatement(node,metadata){
    var _cond = parseBinaryExpression(node.test);
    parsedNodesData.push({  Line: metadata.start.line, Type: node.type, Name: '',Cond:_cond, Value:''});
}

function checkIfElseStatement(line){
    for(var i = 0; i < parsedNodesData.length; i++){
        if(parsedNodesData[i].Type === 'IfStatement' && parsedNodesData[i].Line === line) {
            parsedNodesData[i].Type = 'IfElseStatement';
        }
    }
}

function parseIfStatement(node,type, line){
    var _cond = parseBinaryExpression(node.test);
    parsedNodesData.push({  Line: line, Type: type, Name: '',Cond:_cond, Value:''});
    if(node.alternate != null) {
        if (node.alternate.type === 'IfStatement') {
            checkIfElseStatement(node.alternate.loc.start.line);
        }
    }
}

function parseUnaryExpression(node){
    var exp;
    exp = node.operator + node.argument.value;
    return exp;
}

function parseMemberExpression(node){
    var property;
    if(node.property.type ==='BinaryExpression'){
        property = parseBinaryExpression(node.property);
    }
    else{
        property = node.property.name;
    }
    return node.object.name +'[' + property +']';
}

function parseReturnStatement(node,metadata){
    var _value;
    if(node.argument.type === 'UnaryExpression'){
        _value = parseUnaryExpression(node.argument);
    }
    else{
        _value = node.argument.name;
    }
    parsedNodesData.push({  Line: metadata.start.line, Type: node.type, Name: '',Cond:'', Value: _value});
}

export {parseCode};
