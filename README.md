# Rule Engine with AST

This MERN stack project is a 3-tier rule engine application to determine user eligibility based on attributes like age, department, income, and spend. It uses an Abstract Syntax Tree (AST) to create, combine, and modify eligibility rules dynamically.

## Objective
Build a flexible rule engine to evaluate user attributes against rules, using AST for dynamic rule management.

## Structure
- **Client**: React frontend (`client` folder)
- **Server**: Node.js backend (`server` folder)

## Bonus Feature -
Added error handling for incorrect rules and invalid json input for validation


## Data Structure
AST nodes have the following structure:
- **type**: `"operator"` (AND/OR) or `"operand"` (conditions)
- **left** & **right**: Node references
- **value**: Optional value for conditions (e.g., `age > 30`)

### Example Rule
  ```
  rule1: ((age > 30 AND department = 'Sales') OR (age < 25 AND department = 'Marketing')) AND (salary > 50000 OR experience > 5)
  ```

### API Endpoints
**create_rule(rule_string)**: Converts a rule string into an AST.
**combine_rules(rules)**: Combines multiple rules into one AST.
**evaluate_rule(JSON data)**: Evaluates if user data matches the combined rule.

### Running the Application
**Server**:
  ```bash
  cd server
  npm install
  node server.js
  ```

**Client**:
  ```bash
  cd client
  npm install
  npm run dev
  ```

### Technologies
**Frontend**: React.js

**Backend**: Node.js, Express.js

### Sample Testing
**Rule Creation and Evaluation**
![image](https://github.com/user-attachments/assets/f525dba9-f91d-48b3-a65c-6672d62115ab)

**Rule Combination and Evaluation**
![image](https://github.com/user-attachments/assets/577d156e-d55b-4098-8ff3-198e69e78126)
![image](https://github.com/user-attachments/assets/9949bd59-1157-40a5-beef-ff0b506b1ebc)



