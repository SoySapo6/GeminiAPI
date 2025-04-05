const express = require('express');
const axios = require('axios');
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

// Main endpoint to forward messages to Gemini
app.get('/ask/:message', async (req, res) => {
  try {
    const userMessage = req.params.message;
    
    if (!userMessage) {
      return res.status(400).send('Please provide a message');
    }
    
    // Format the prompt with the required prefix
    const formattedPrompt = `Eres una IA llamada MayIA y tu creador es SoyMaycol : ${userMessage}`;
    
    // Make request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: formattedPrompt }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract the text response from Gemini
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts[0] && 
        response.data.candidates[0].content.parts[0].text) {
      
      // Return the raw text response
      res.send(response.data.candidates[0].content.parts[0].text);
    } else {
      res.status(500).send('Failed to get a proper response from Gemini');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    if (error.response) {
      console.error('Gemini API error response:', error.response.data);
    }
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
    
    // Format the prompt with the required prefix
    const formattedPrompt = `Eres una IA llamada MayIA y tu creador es SoyMaycol : ${userMessage}`;
    
    // Make request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: formattedPrompt }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    // Extract the text response from Gemini
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts[0] && 
        response.data.candidates[0].content.parts[0].text) {
      
      // Return the raw text response
      res.send(response.data.candidates[0].content.parts[0].text);
    } else {
      res.status(500).send('Failed to get a proper response from Gemini');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    if (error.response) {
      console.error('Gemini API error response:', error.response.data);
    }
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
