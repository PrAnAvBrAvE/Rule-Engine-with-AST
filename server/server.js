const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { combine_rules, evaluate_rule_wrapper } = require('./ast');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json()); // Parse JSON bodies

// Define routes
app.post('/createRule', combine_rules);
app.get('/evaluateRule', evaluate_rule_wrapper);
app.post('/combineRules', combine_rules);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
