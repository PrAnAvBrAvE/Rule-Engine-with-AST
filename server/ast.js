const { json } = require("body-parser");

// Node structure for the AST
class ASTNode {
    constructor(type, value = null, left = null, right = null) {
        this.type = type; // "operator" or "operand"
        this.value = value; // Operator or operand value
        this.left = left; // Left child
        this.right = right; // Right child
    }
}

let finalAst;
// Function to parse a single condition into an operand node
function parseCondition(condition) {
    const regex = /(\w+)\s*(>=|<=|>|<|=)\s*(['"]?[^'"]*['"]?)/; // Regex for condition
    const match = condition.match(regex);

    if (!match) {
        throw new Error(`Invalid condition: ${condition}`);
    }

    const attribute = match[1].trim();
    const operator = match[2].trim();
    const value = match[3].trim().replace(/['"]/g, ''); // Remove quotes

    return new ASTNode("operand", { attribute, operator, value });
}

// Function to parse and create an operator node
function parseOperator(left, operator, right) {
    return new ASTNode("operator", operator, left, right);
}

// Function to build AST from a rule string
function create_rule(ruleString) {

    ruleString = ruleString.trim().replace(/^\(\s*|\s*$/g, '').replace(/\s*$/, '');
    let ast = null;
    const tokens = ruleString.split(/\s+(AND|OR)\s+/);

    let currentOperator = null;

    for (const token of tokens) {
        const trimmedToken = token.trim();

        if (trimmedToken === "AND" || trimmedToken === "OR") {
            currentOperator = trimmedToken;
            continue;
        }

        const conditionNode = parseCondition(trimmedToken);

        if (!ast) {
            ast = conditionNode; // First condition
        } else if (currentOperator) {
            ast = parseOperator(ast, currentOperator, conditionNode);
            currentOperator = null; // Reset operator after use
        } else {
            throw new Error("Invalid rule string");
        }
    }

    return ast; // Return the entire AST
}



// Function to combine multiple rules into a single AST
function combine_rules(req, res) {
    
    let rules;
    if(req.body.ruleString)
        rules = [req.body.ruleString];
    else
        rules = req.body.rules;
    if (rules.length === 0) return null;

    let combinedAST = null;

    for (const rule of rules) {
        const ast = create_rule(rule);
        combinedAST = combinedAST ? parseOperator(combinedAST, "AND", ast) : ast; // Combine using AND for simplicity
    }

    finalAst = combinedAST;

    res.status(200).send({"ast" :combinedAST});
}



// Helper function to evaluate a single operand
function evaluateOperand(operand, data) {
    const { attribute, operator, value } = operand.value;
    const dataValue = data[attribute];

    switch (operator) {
        case '=':
            return dataValue == value; // Use == to allow type coercion
        case '>':
            return dataValue > value;
        case '<':
            return dataValue < value;
        case '>=':
            return dataValue >= value;
        case '<=':
            return dataValue <= value;
        default:
            throw new Error(`Unsupported operator: ${operator}`);
    }
}

// Recursive function to evaluate the AST
function evaluateAST(node, data) {
    if (node.type === 'operand') {
        return evaluateOperand(node, data);
    }

    if (node.type === 'operator') {
        const leftResult = evaluateAST(node.left, data);
        const rightResult = evaluateAST(node.right, data);

        switch (node.value) {
            case 'AND':
                return leftResult && rightResult;
            case 'OR':
                return leftResult || rightResult;
            default:
                throw new Error(`Unsupported operator: ${node.value}`);
        }
    }

    throw new Error('Invalid AST node');
}

// Main function to evaluate the combined rules against data
function evaluate_rule(data, combinedAST) {
    try {
        return evaluateAST(combinedAST, data);
    } catch (error) {
        throw new Error(`Error evaluating rule: ${error.message}`);
    }
}

function evaluate_rule_wrapper(req, res)
{
    const data = JSON.parse(req.query.data);
    const ans = evaluate_rule(data, finalAst);

    res.status(200).send({"result" : ans});
}
// Example usage
// const rules = [
//     "age > 30 AND department = 'Sales'",
//     "salary >= 60000 OR experience < 5"
// ];

// const combinedAST = combine_rules(rules);
// const data = { age: 15, department: "Sales", salary: 60000, experience: 3 };

// const result = evaluate_rule(data, combinedAST);
// console.log(result); // Should return true or false based on the combined rules and data

module.exports = {
    combine_rules,
    evaluate_rule_wrapper
};
