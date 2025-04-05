const express = require('express');
const axios = require('axios');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = 8000; // Backend API port

// Get API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "AIzaSyCYWNbM2ZgdDSp9NlFxTgp0Wtwaaw7dyRc";

// Middleware to parse JSON requests
app.use(express.json());

// Basic health check endpoint
app.get('/', (req, res) => {
  res.status(200).send('Gemini Forwarding API is running');
});

// Main endpoint to forward messages to Gemini using direct curl
app.get('/ask/:message', async (req, res) => {
  try {
    const userMessage = req.params.message;
    
    if (!userMessage) {
      return res.status(400).send('Please provide a message');
    }
    
    // Use direct curl command as provided in the example
    const command = `curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}" \\
      -H "Content-Type: application/json" \\
      -X POST \\
      -d '{
        "contents": [{
          "parts": [{"text": "Eres una IA y te llamas MayIA y te creo SoyMaycol : ${userMessage}"}]
        }]
      }'`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send(`Error: ${error.message}`);
      }
      
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).send(`Error: ${stderr}`);
      }
      
      try {
        // Parse the JSON response
        const jsonResponse = JSON.parse(stdout);
        
        // Extract the text from the response
        if (jsonResponse && 
            jsonResponse.candidates && 
            jsonResponse.candidates[0] && 
            jsonResponse.candidates[0].content && 
            jsonResponse.candidates[0].content.parts && 
            jsonResponse.candidates[0].content.parts[0] && 
            jsonResponse.candidates[0].content.parts[0].text) {
          
          // Send just the raw text
          res.send(jsonResponse.candidates[0].content.parts[0].text);
        } else {
          res.status(500).send('Failed to get a proper response from Gemini');
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).send(`Error parsing response: ${parseError.message}`);
      }
    });
  } catch (error) {
    console.error('Error in request:', error.message);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Alternative endpoint that accepts query parameter
app.get('/ask', async (req, res) => {
  try {
    const userMessage = req.query.message;
    
    if (!userMessage) {
      return res.status(400).send('Please provide a message parameter');
    }
    
    // Use direct curl command as provided in the example
    const command = `curl -s "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}" \\
      -H "Content-Type: application/json" \\
      -X POST \\
      -d '{
        "contents": [{
          "parts": [{"text": "Eres una IA y te llamas MayIA y te creo SoyMaycol : ${userMessage}"}]
        }]
      }'`;
    
    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error: ${error.message}`);
        return res.status(500).send(`Error: ${error.message}`);
      }
      
      if (stderr) {
        console.error(`stderr: ${stderr}`);
        return res.status(500).send(`Error: ${stderr}`);
      }
      
      try {
        // Parse the JSON response
        const jsonResponse = JSON.parse(stdout);
        
        // Extract the text from the response
        if (jsonResponse && 
            jsonResponse.candidates && 
            jsonResponse.candidates[0] && 
            jsonResponse.candidates[0].content && 
            jsonResponse.candidates[0].content.parts && 
            jsonResponse.candidates[0].content.parts[0] && 
            jsonResponse.candidates[0].content.parts[0].text) {
          
          // Send just the raw text
          res.send(jsonResponse.candidates[0].content.parts[0].text);
        } else {
          res.status(500).send('Failed to get a proper response from Gemini');
        }
      } catch (parseError) {
        console.error('Error parsing JSON:', parseError);
        res.status(500).send(`Error parsing response: ${parseError.message}`);
      }
    });
  } catch (error) {
    console.error('Error in request:', error.message);
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
