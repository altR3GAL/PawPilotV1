require('dotenv').config();
const axios = require('axios');
const port = process.env.PORT || 3000;
const bodyParser = require('body-parser');
const path = require('path');
const express = require('express');
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const openAIKey = process.env.OPENAI_API_KEY;

async function breakdownAssistant(userMessage) {
    try {
        const messages = [
            {"role": "system", "content": "As a Coding Assignment Analysis Assistant, your role is to simplify and outline coding assignments, guiding students with a structured approach for clarity and effective problem-solving. This involves breaking down tasks into manageable sections, detailing instructions for each, and offering step-by-step guidance. 1. Assignment Overview: Identify the programming language and environment. Clarify assignment objectives. Analyze functions and context. 2. Instructions for Each Section: Provide syntax and style guidelines. Detail logical components and their purposes. Offer security and optimization tips. 3. Implementation Guidance: Give detailed steps for each identified function, stressing the importance of this phase with at least three key points per function Include coding examples.  Highlight common pitfalls.  4. Resource Compilation: Compile targeted resources, including direct links and diverse learning materials. 5. Execution Strategy: Suggest a structured approach with milestones. Provide testing and debugging advice. Recommend version control best practices. Continuous Improvement: Implement a feedback mechanism. Encourage progress updates and motivational support, emphasizing learning from mistakes and persistence."},
            {"role": "user", "content": userMessage}
        ];
        
        const response = await axios.post(
            `https://api.openai.com/v1/chat/completions`,
            {
                model: "gpt-4-turbo-preview",
                messages: messages,
            },
            {
                headers: {
                    'Authorization': `Bearer ${openAIKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling OpenAI Assistant:', error.response ? error.response.data : error);
        throw new Error('Failed to call the assistant.');
    }
}

async function reviewAssistant(userMessage) {
    try {
        const messages = [
            {"role": "system", "content": "As a Coding Class Copilot/Helper, aim to provide detailed, actionable feedback on coding assignments by analyzing every function, highlighting strengths and improvement areas with specific code references, and offering at least two enhancement suggestions per function. 1. Pre-Analysis: Confirm programming language, understand code context, gather relevant resources. 2. Code Analysis: Check syntax, verify style, evaluate logic, and perform security and performance checks. 3. Feedback Generation: Offer detailed feedback for each function, including specific code references, mix positive notes with constructive criticism, and provide at least two suggestions per function with rationales. 4. Resource Provision: Match resources to feedback topics, provide direct links, and cater to diverse learning styles. 5. Feedback Delivery: Present feedback in a clear, structured format with encouragement for further learning. Continuous Improvement: Regularly solicit user feedback, keep resources current, and refine feedback mechanisms. Emphasize code references and multiple suggestions per function for comprehensive learning and coding skill development."},
            {"role": "user", "content": userMessage}
        ];
        
        const response = await axios.post(
            `https://api.openai.com/v1/chat/completions`,
            {
                model: "gpt-4-turbo-preview",
                messages: messages,
            },
            {
                headers: {
                    'Authorization': `Bearer ${openAIKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling OpenAI Assistant:', error.response ? error.response.data : error);
        throw new Error('Failed to call the assistant.');
    }
}

async function resourceAssistant(userMessage) {
    try {
        const messages = [
            {"role": "system", "content": "You are supposed to provide users with 10 links to articles explaining their topic and concept of choice as well as 10 more videos doing the same"},
            {"role": "user", "content": userMessage}
        ];
        
        const response = await axios.post(
            `https://api.openai.com/v1/chat/completions`,
            {
                model: "gpt-4-turbo-preview",
                messages: messages,
            },
            {
                headers: {
                    'Authorization': `Bearer ${openAIKey}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('Error calling OpenAI Assistant:', error.response ? error.response.data : error);
        throw new Error('Failed to call the assistant.');
    }
}

// async function testAssistant() {
//     try {
//         const response = await breakdownAssistant("I have a lot of coding instructions in front of me. it says to print hello world then make a loop, initialize things and so on!");
//         console.log(response); // Log the assistant's response
//     } catch (error) {
//         console.error(error);
//     }
// }

// testAssistant(); // Invoke the test function

// Example usage
app.post('/askBreakdown', async (req, res) => {
    const { userMessage } = req.body; // Assume the body has a userMessage field
    try {
        const assistantResponse = await breakdownAssistant(userMessage);
        res.json({ success: true, response: assistantResponse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/askReview', async (req, res) => {
    const { userMessage } = req.body; // Assume the body has a userMessage field
    try {
        const assistantResponse = await reviewAssistant(userMessage);
        res.json({ success: true, response: assistantResponse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.post('/askResource', async (req, res) => {
    const { userMessage } = req.body; // Assume the body has a userMessage field
    try {
        const assistantResponse = await resourceAssistant(userMessage);
        res.json({ success: true, response: assistantResponse });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});


app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

