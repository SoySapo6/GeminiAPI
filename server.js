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

// Main endpoint to forward messages to Gemini directly through axios
app.get('/ask/:message', async (req, res) => {
  try {
    const userMessage = req.params.message;
    
    if (!userMessage) {
      return res.status(400).send('Please provide a message');
    }
    
    console.log(`Processing request for message: ${userMessage}`);
    
    // Make request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: `Eres una IA y te llamas MayIA y te creo SoyMaycol : ${userMessage}` }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log("Response from Gemini API received");
    
    // Extract the text response from Gemini
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts[0] && 
        response.data.candidates[0].content.parts[0].text) {
      
      const geminiText = response.data.candidates[0].content.parts[0].text;
      console.log(`Sending Gemini response: ${geminiText.substring(0, 50)}...`);
      
      // Return the raw text response
      res.send(geminiText);
    } else {
      console.error("Failed to get proper response structure from Gemini");
      console.error("Response data:", JSON.stringify(response.data).substring(0, 500));
      res.status(500).send('Failed to get a proper response from Gemini');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    if (error.response) {
      console.error('Gemini API error response:', JSON.stringify(error.response.data).substring(0, 500));
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
    
    console.log(`Processing request for message (query): ${userMessage}`);
    
    // Make request to Gemini API
    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{
          parts: [{ text: `Eres una IA y te llamas MayIA y te creo SoyMaycol : ${userMessage}` }]
        }]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log("Response from Gemini API received");
    
    // Extract the text response from Gemini
    if (response.data && 
        response.data.candidates && 
        response.data.candidates[0] && 
        response.data.candidates[0].content && 
        response.data.candidates[0].content.parts && 
        response.data.candidates[0].content.parts[0] && 
        response.data.candidates[0].content.parts[0].text) {
      
      const geminiText = response.data.candidates[0].content.parts[0].text;
      console.log(`Sending Gemini response: ${geminiText.substring(0, 50)}...`);
      
      // Return the raw text response
      res.send(geminiText);
    } else {
      console.error("Failed to get proper response structure from Gemini");
      console.error("Response data:", JSON.stringify(response.data).substring(0, 500));
      res.status(500).send('Failed to get a proper response from Gemini');
    }
  } catch (error) {
    console.error('Error calling Gemini API:', error.message);
    if (error.response) {
      console.error('Gemini API error response:', JSON.stringify(error.response.data).substring(0, 500));
    }
    res.status(500).send(`Error: ${error.message}`);
  }
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running on http://0.0.0.0:${PORT}`);
});
