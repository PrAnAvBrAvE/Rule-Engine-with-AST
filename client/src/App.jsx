// src/App.js

import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [ruleString, setRuleString] = useState('');
    const [rules, setRules] = useState([]);
    const [data, setData] = useState('');
    const [evaluationResult, setEvaluationResult] = useState(null);
    const [combinedAST, setCombinedAST] = useState(null);
    
    const createRule = async () => {
        try {
            const response = await axios.post('http://localhost:5000/createRule', { ruleString });
            console.log('Rule created:', response.data.ast);
        } catch (error) {
            console.error('Error creating rule:', error.response.data);
        }
    };

    const combineRules = async () => {
        try {
            const response = await axios.post('http://localhost:5000/combineRules', { rules });
            setCombinedAST(response.data.ast);
            console.log('Combined AST:', response.data.ast);
        } catch (error) {
            console.error('Error combining rules:', error.response.data);
        }
    };

    const evaluateRule = async () => {
        try {
            // Parse the JSON data entered by the user
            const jsonData = JSON.parse(data); // Parse the JSON data entered by the user
            const queryString = encodeURIComponent(JSON.stringify(jsonData));
            const response = await axios.get(`http://localhost:5000/evaluateRule?data=${queryString}`);
            console.log(response);
            setEvaluationResult(response.data.result);
        } catch (error) {
            console.error('Error evaluating rule:', error);
        } 
    };

    return (
        <div>
            <h1>Rule Management</h1>
            <div>
                <h2>Create Rule</h2>
                <textarea
                    value={ruleString}
                    onChange={(e) => setRuleString(e.target.value)}
                    placeholder="Enter rule string (e.g. age > 30 AND department = 'Sales')"
                />
                <button onClick={createRule}>Create Rule</button>
            </div>
            <div>
                <h2>Combine Rules</h2>
                <textarea
                    value={rules.join(',')}
                    onChange={(e) => setRules(e.target.value.split(',').filter(Boolean))}
                    placeholder="Enter comma separated rules"
                />
                <button onClick={combineRules}>Combine Rules</button>
            </div>
            <div>
                <h2>Evaluate Rule</h2>
                <textarea
                    value={data}
                    onChange={(e) => setData(e.target.value)}
                    placeholder='Enter JSON data (e.g. {"age": 35, "department": "Sales", "salary": 60000, "experience": 3})'
                />
                <button onClick={evaluateRule}>Evaluate Rule</button>
                {evaluationResult !== null && (
                    <div>
                        <h3>Evaluation Result: {evaluationResult ? 'True' : 'False'}</h3>
                    </div>
                )}
            </div>
        </div>
    );
};

export default App;
